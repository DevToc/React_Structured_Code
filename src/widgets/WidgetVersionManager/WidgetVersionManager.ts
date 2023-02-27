import clonedeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

import { WidgetType, Widget } from 'types/widget.types';
import { WidgetsMap } from 'types/infographTypes';
import { GroupWidgetData } from 'widgets/GroupWidget/GroupWidget.types';
import { getWidgetTypeFromId } from '../Widget.helpers';
import { WidgetVersionController } from './WidgetVersionManager.types';
import { WidgetVersionConfig } from './WidgetVersionManager.types';

// The WidgetVersionManager updates widgets to the latest version
// This is important because we want to:
// 1. Have a simple way to keep widgets updated to the latest version
// 2. Not add exceptions for older widget versions in the widget code itself

// Implementation:
// 1. Each widget has a list of version controllers (in the order of oldest to newest version)
//    in [widget].upgrade.ts
// 2. Each version controller has an upgrade function
//    - The upgrade function can optionally return a WidgetMap if new widgets need to
//      be added to the store - i.e. responsive widgets that need to add members
// 3. the WidgetVersionManager is a singleton with a public update method,
//    that updates all widgets to their latest version
//    (this should be called before widgets are loaded into the App state)

class WidgetVersionManager {
  private allVersionControllers: Map<WidgetType, WidgetVersionController[]>;
  private static instance: WidgetVersionManager;

  private constructor() {
    this.allVersionControllers = new Map();
  }

  init(widgetVersionConfig: WidgetVersionConfig) {
    const widgetTypes = Object.values(WidgetType);

    // register all widget version controllers
    widgetTypes.forEach((type: WidgetType) => {
      const controllers = widgetVersionConfig[type]?.controllers;
      const latestVersion = widgetVersionConfig[type]?.latestVersion;

      if (!controllers) throw Error(`No version controllers found for widget type ${type}`);
      this.registerController(type, controllers);

      if (latestVersion !== this.getLatestVersion(type)) {
        throw Error(`widget ${type} is missing a version controller for version: ${latestVersion}`);
      }
    });
  }

  // update all the widgets in the WidgetsMap to the latest version
  update(widgets: WidgetsMap): WidgetsMap {
    const allWidgetIds = Object.keys(widgets);
    const updatedWidgets: WidgetsMap = {};

    allWidgetIds.forEach((widgetId) => {
      const widget = widgets[widgetId];
      const widgetType = getWidgetTypeFromId(widgetId);
      const memberWidgetIds = (widget as GroupWidgetData).memberWidgetIds;
      const memberWidgets: WidgetsMap = {};

      if (memberWidgetIds) {
        memberWidgetIds.forEach((memberWidgetId) => {
          const memberWidget = updatedWidgets[memberWidgetId] || widgets[memberWidgetId];
          if (!memberWidget) console.warn(`memberWidget ${memberWidgetId} not found`);
          else memberWidgets[memberWidgetId] = memberWidget;
        });
      }

      const { updatedWidget, addWidgets } = this.manageVersion(widget, widgetType, memberWidgets);

      updatedWidgets[widgetId] = updatedWidget;

      // Add new widgets to the widget map if any specified
      if (!!addWidgets) {
        for (const [newWId, newWidget] of Object.entries(addWidgets)) {
          updatedWidgets[newWId] = newWidget;
        }
      }
    });

    return updatedWidgets;
  }

  // Remove all the widget version controllers
  cleanup() {
    this.allVersionControllers.clear();
  }

  // register all widget version controllers for a widget
  private registerController(widgetType: WidgetType, versionController: WidgetVersionController[]) {
    this.allVersionControllers.set(widgetType, versionController);
  }

  private getController(widgetType: WidgetType): WidgetVersionController[] | undefined {
    return this.allVersionControllers.get(widgetType);
  }

  // get the latest version number of a widget
  // if the widget doesn't have any version returns 0
  private getLatestVersion(widgetType: WidgetType): number {
    const versionController = this.getController(widgetType);
    if (!versionController) throw Error(`No version controller found for widget type ${widgetType}`);
    // The first widget version has no version controller
    if (!versionController.length) return 1;

    return versionController[versionController.length - 1].version;
  }

  // upgrade or downgrade the widget to the latest version
  private manageVersion(
    widget: Widget,
    widgetType: WidgetType,
    memberWidgets: WidgetsMap,
  ): {
    updatedWidget: Widget;
    addWidgets?: WidgetsMap;
  } {
    if (!widget || !widgetType) throw Error('Widget or widget type is missing');
    const clonedWidget = clonedeep(widget);

    const versionController = this.getController(widgetType);
    if (!versionController || !versionController.length) return { updatedWidget: clonedWidget };

    // old widgets don't have the version property
    if (!clonedWidget.version) clonedWidget.version = 1;

    // if the widget is the latest version, do nothing
    const latestVersion = this.getLatestVersion(widgetType);
    if (clonedWidget.version === latestVersion)
      return {
        updatedWidget: clonedWidget,
      };

    // update the widget data with the version controllers
    const shouldUpgrade = clonedWidget.version < latestVersion;
    const newWidgetMap = {};
    if (shouldUpgrade) {
      for (let i = clonedWidget.version; i < latestVersion; i++) {
        // find the version controller for the next version
        const controller = versionController.find(
          (controller: WidgetVersionController) => controller.version - 1 === i,
        );

        if (controller) {
          const upgradeResult = controller.upgrade(clonedWidget, memberWidgets);
          if (!!upgradeResult) {
            merge(newWidgetMap, upgradeResult);
          }
        } else throw new Error(`No upgrade found for widget ${widgetType} version ${i}`);
      }
    }

    // set the widget version to the latest version
    clonedWidget.version = latestVersion;

    return {
      updatedWidget: clonedWidget,
      addWidgets: newWidgetMap,
    };
  }

  public static getInstance(): WidgetVersionManager {
    if (!WidgetVersionManager.instance) {
      WidgetVersionManager.instance = new WidgetVersionManager();
    }

    return WidgetVersionManager.instance;
  }
}

export default WidgetVersionManager;

import { cloneElement, ReactElement } from 'react';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';

// TODO: As we extend share functionalities on E2,
// there will be more methods needed such as Edit Link, With Team
export enum ShareMethod {
  PrivateLink = 'Private Link',
}

export enum EventPropsBool {
  true = 'TRUE',
  false = 'FALSE',
}

interface eventPropsDesc {
  name: string;
  from?: string;
  help_type?: string;
  header_type?: string;
  a11y_checker_items?: string;
  number_of_headers?: string;
  text_tag?: string;
  text_style?: string;
  language?: string;
  alt_text_value?: string;
  // Critical events' properties
  editor_version?: string;
  design_id?: string;
  share_method?: ShareMethod;
  is_design_owner?: EventPropsBool;
}

interface ClickEventTrackerProps {
  children: ReactElement; // only single child allowed
  eventProps: eventPropsDesc;
}

// It is a wrapper of element that needs to bind tracking events
// by third part lib such as mixpanel or intercom
export const ClickEventTracker = ({ children: child, eventProps }: ClickEventTrackerProps) => {
  const handleClickTargetElm = () => {
    child.props.onClick?.();

    const { name, ...props } = eventProps;

    Mixpanel.track(name, props);
  };

  return cloneElement(child, { onClick: handleClickTargetElm });
};

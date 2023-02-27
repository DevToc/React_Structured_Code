import { ReactElement, Suspense } from 'react';
import { Provider } from 'react-redux';
import { Flex, Spinner } from '@chakra-ui/react';

import { useDynamicImport } from 'hooks/useDynamicImport';
import { useViewport } from 'hooks/useViewport';

import { Toolbar } from './components/Toolbar';
import { IntercomProvider } from '../../libs/third-party/Intercom/intercomProvider';

import { CheckerSettingsProvider } from './components/AccessibilityManager/AccessibilityChecker/checker.provider';
import { AccessibilityMenu } from './components/AccessibilityManager/AccessibilityManager';
import { BoundingBoxProvider } from './components/BoundingBox/useBoundingBox';
import { Clipboard } from './components/Clipboard';
import { FlowModeProvider } from './components/FlowCore/FlowModeProvider';
import { Focus, FocusProvider } from './components/Focus';
import { Head } from './components/Head';
import { KeyboardShortcut } from './components/KeyboardShortcut';
import { SideMenuSettings } from './components/SideMenuSettings/SideMenuSettings';
import { SkipLinks } from './components/SkipLinks';
import { InContextToolbar } from './components/InContextToolbar';
import { ResponsiveComponentsMap } from './components.lazy';

import { store } from './store';
import { PersistManagerProvider } from './store/persistManager';
import { HistoryManagerProvider } from './store/history/historyManager';

import { InfographLoader } from '../InfographLoader';

const Editor = (): ReactElement => {
  const { isMobile, viewportHeight } = useViewport();

  const ResponsiveComponent = (name: string): ReactElement => {
    const Component = useDynamicImport(name, ResponsiveComponentsMap);
    return (
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    );
  };

  const Navbar = (): ReactElement => ResponsiveComponent('navbar');
  const PageArea = (): ReactElement => ResponsiveComponent('pageArea');
  const WidgetMenu = (): ReactElement => ResponsiveComponent('widget');

  return (
    <IntercomProvider>
      <Provider store={store}>
        <Head />
        <SkipLinks />
        <BoundingBoxProvider>
          <HistoryManagerProvider>
            <FocusProvider>
              <CheckerSettingsProvider>
                <PersistManagerProvider>
                  <Navbar />
                </PersistManagerProvider>
                <AccessibilityMenu />
              </CheckerSettingsProvider>
              <InfographLoader>
                <Flex as='main' minH={viewportHeight}>
                  <WidgetMenu />
                  <FlowModeProvider>
                    <Flex flex='1' direction='column' position='relative'>
                      {!isMobile && <Toolbar />}
                      <PageArea />
                      {isMobile && <InContextToolbar />}
                    </Flex>
                  </FlowModeProvider>
                  <SideMenuSettings />
                </Flex>
                <KeyboardShortcut />
                <Clipboard />
                <Focus />
              </InfographLoader>
            </FocusProvider>
          </HistoryManagerProvider>
        </BoundingBoxProvider>
      </Provider>
    </IntercomProvider>
  );
};

export default Editor;

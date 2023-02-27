import { Suspense, lazy, ReactElement } from 'react';
import { ChakraProvider, Center, Box } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ViewportProvider } from './context';

import { ReactComponent as VenngageLogoIcon } from 'assets/icons/venngage_logo.svg';
import { theme } from './theme';

// We can move this to editor container if other view no need translation
import './i18n';

import './app.css';

const Editor = lazy(
  () =>
    import(
      /* webpackChunkName: "Editor" */
      /* webpackPrefetch: true */
      './modules/Editor'
    ),
);

const Export = lazy(
  () =>
    import(
      /* webpackChunkName: "Export" */
      /* webpackPrefetch: true */
      './modules/Export'
    ),
);

const PrivateLinkView = lazy(
  () =>
    import(
      /* webpackChunkName: "PrivateLinkView" */
      /* webpackPrefetch: true */
      './modules/PrivateLinkView'
    ),
);

const Admin = lazy(
  () =>
    import(
      /* webpackChunkName: "Admin" */
      /* webpackPrefetch: true */
      './modules/Admin'
    ),
);

const SuspenseEditor = (): ReactElement => (
  // TODO: Need a fancy UI spinner
  <Suspense fallback={'loading...'}>
    <ViewportProvider>
      <Editor />
    </ViewportProvider>
  </Suspense>
);

const SuspenseExport = (): ReactElement => (
  // Empty component fallback for export view
  <Suspense fallback={<></>}>
    <Export />
  </Suspense>
);

const SuspensePrivateLinkView = (): ReactElement => (
  // Empty component fallback for export view
  <Suspense fallback={<></>}>
    <PrivateLinkView />
  </Suspense>
);

const SuspenseAdmin = (): ReactElement => (
  <Suspense fallback={'loading ...'}>
    <Admin />
  </Suspense>
);

/**
 * Double-clicking on the logo navigates to admin page.
 * @constructor
 */
const JustLogo = (): ReactElement => {
  let navigate = useNavigate();

  function handleClick() {
    navigate('/admin');
  }

  return (
    <Center h='100vh'>
      <Box onDoubleClick={handleClick}>
        <VenngageLogoIcon />
      </Box>
    </Center>
  );
};

export const App = (): ReactElement => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path='design/:id' element={<SuspenseEditor />} />
        <Route path='export/:id' element={<SuspenseExport />} />
        <Route path='pl/:privateLinkId' element={<SuspensePrivateLinkView />} />
        <Route path='export/:id/:pageId' element={<SuspenseExport />} />
        <Route path='admin' element={<SuspenseAdmin />} />
        <Route path='*' element={<JustLogo />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);

export default App;

import React, { useContext, useCallback } from 'react';
import IntercomContext from './intercomContext';
import { useUser } from '../../../hooks/useUser';
import initialize from './initialize';

const intercomAppId = process.env.REACT_APP_INTERCOM_APP_ID as string;

type IntercomContextProviderProps = {
  children: React.ReactNode;
};

type IntercomContextType = Intercom_.IntercomCommandSignature;

// to use this provider, place `IntercomProvider` as high as possible in the rendering structure.
// call useIntercom in any child component to use any method like this, {boot, shutdown, ...<other methods>} = useIntercom()
// make sure to call useIntercom within the Provider

export const IntercomProvider = ({ children }: IntercomContextProviderProps) => {
  const boot = useCallback((props: Intercom_.IntercomSettings) => {
    if (!!window.Intercom) {
      window.Intercom('boot', { ...props });
    }
  }, []);

  const shutdown = useCallback(() => {
    if (!window.Intercom) return;
    window.Intercom('shutdown');
    delete window.intercomSettings;
  }, []);

  const startTour = useCallback((tourId: number) => {
    if (!window.Intercom) {
      console.error('Intercom is not booted');
      return;
    }
    window.Intercom('startTour', tourId);
  }, []);

  const trackEvent = useCallback((event: string, metaData?: object) => {
    if (!window.Intercom) {
      console.error('Intercom is not booted');
      return;
    }
    if (metaData) {
      window.Intercom('trackEvent', event, metaData);
    } else {
      window.Intercom('trackEvent', event);
    }
  }, []);

  const showArticle = useCallback((articleId: number) => {
    if (!window.Intercom) {
      console.error('Intercom is not booted');
      return;
    }
    window.Intercom('showArticle', articleId);
  }, []);

  const providerValues = {
    boot,
    shutdown,
    startTour,
    trackEvent,
    showArticle,
  };

  if (!window.Intercom) initialize(intercomAppId);
  const { data: userInfo } = useUser();
  if (!!window.Intercom && userInfo && !!userInfo.use_intercom) {
    boot({
      app_id: intercomAppId,
      email: userInfo.email,
      user_id: userInfo.user_id,
      name: `${userInfo.first_name} ${userInfo.last_name}`,
      created_at: new Date(userInfo.created_at).getTime(),
    });
  }

  return <IntercomContext.Provider value={providerValues}>{children}</IntercomContext.Provider>;
};

export const useIntercom = () => {
  const interContext = useContext(IntercomContext);
  return interContext as IntercomContextType;
};

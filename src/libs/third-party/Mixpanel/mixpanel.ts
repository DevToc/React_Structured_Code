import mixpanel, { Mixpanel as MixpanelInterface, Dict, Callback } from 'mixpanel-browser';

// use a fake token when it's not available to prevent breaking the app
const mixpanelToken = process.env.REACT_APP_MIXPANEL_TOKEN ?? '123';
mixpanel.init(mixpanelToken);

// mixpanel browser is the official npm package published by mixpanel, and types come from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mixpanel-browser/index.d.ts
// We don't need all the methods from mixpanel, only define the necessary methods in MixpanelActions
interface MixpanelActions
  extends Omit<
    MixpanelInterface,
    | 'people'
    | 'add_group'
    | 'clear_opt_in_out_tracking'
    | 'disable'
    | 'get_config'
    | 'get_distinct_id'
    | 'get_group'
    | 'get_property'
    | 'has_opted_in_tracking'
    | 'has_opted_out_tracking'
    | 'init'
    | 'opt_in_tracking'
    | 'opt_out_tracking'
    | 'push'
    | 'register'
    | 'register_once'
    | 'remove_group'
    | 'reset'
    | 'set_config'
    | 'set_group'
    | 'time_event'
    | 'track_forms'
    | 'track_links'
    | 'track_with_groups'
    | 'unregister'
  > {
  people: {
    set(prop: string, to: any, callback?: Callback): void;
    set(prop: Dict, callback?: Callback): void;
  };
}

// To use mixpanel, import { Mixpanel } from .. in any component and call mixpanel.<action/method name>
const actions: MixpanelActions = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (eventName, props?) => {
    if (!!props) {
      mixpanel.track(eventName, props);
    } else {
      mixpanel.track(eventName);
    }
  },
  people: {
    set(prop: Dict | string, to?: any, callback?: Callback) {
      if (typeof prop === 'string' && !!to && !callback) {
        mixpanel.people.set(prop, to);
      } else if (typeof prop === 'string' && !!to && !!callback) {
        mixpanel.people.set(prop, to, callback);
      } else if (typeof prop !== 'string' && !callback) {
        mixpanel.people.set(prop);
      } else if (typeof prop !== 'string' && !!callback) {
        mixpanel.people.set(prop, callback);
      }
    },
  },
};

export const Mixpanel = actions;

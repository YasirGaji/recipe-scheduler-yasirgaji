import type { Event } from '@recipe-scheduler/shared-types';

export type RootStackParamList = {
  EventsList: undefined;
  EventDetail: {
    event: Event;
    onUpdate: () => void;
  };
};

export type TabParamList = {
  Events: undefined;
  Add: undefined;
  Settings: undefined;
};
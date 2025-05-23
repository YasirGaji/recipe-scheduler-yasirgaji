export interface CreateEventPayload {
  title: string;
  eventTime: string;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  eventTime: string;
  createdAt: string;
}

export interface PushToken {
  userId: string;
  token: string;
}

export interface NotificationPayload {
  title: string;
  eventTime: string;
}
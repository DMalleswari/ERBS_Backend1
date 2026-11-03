export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export type NotificationDto = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

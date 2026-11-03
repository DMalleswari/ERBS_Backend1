export type BookingRecord = {
  id: string;
  userId: string;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  status: "ACTIVE" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
};

export type BookingDto = {
  id: string;
  userId: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

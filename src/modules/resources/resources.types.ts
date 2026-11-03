export type ResourceRecord = {
  id: string;
  name: string;
  description: string | null;
  resourceTypeId: string;
  capacity: number;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ResourceDto = {
  id: string;
  name: string;
  description: string | null;
  resourceTypeId: string;
  capacity: number;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

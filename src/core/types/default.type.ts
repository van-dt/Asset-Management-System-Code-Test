import { EStatus } from '@prisma/client';

export type AssetData = {
  id: string;
  type: string;
  serial: string;
  status: EStatus;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
};

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type DayHours = {
  openTime: string;
  closeTime: string;
  isDayOff: boolean;
};

export type BusinessHours = Record<DayKey, DayHours>;

type DayBusinessHours = {
  openTime: string | null;
  closeTime: string | null;
};

export type UpdateBusinessHoursRequest = Record<DayKey, DayBusinessHours>;

export type ShopBusinessHoursResponse = Record<DayKey, DayBusinessHours>;

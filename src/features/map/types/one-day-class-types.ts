export interface ClassListItem {
  classId: number;
  className: string;
  classDescription: string | null;
  firstImageUrl: string | null;
  maxCapacity: number | null;
  notes: string | null;
}

export interface ClassListResponse {
  items: ClassListItem[];
  page: number;
  totalPages: number;
}

export interface AvailableSlot {
  sessionId: number;
  time: string;
  remainingCapacity: number | null;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  openTime: string | null;
  closeTime: string | null;
  slots: AvailableSlot[];
}

export interface CreateReservationRequest {
  sessionId: number;
  guestCount: number;
  reservationName: string;
  memo: string;
}

export interface CreateReservationResponse {
  reservationId: number;
  reservationStatus: string;
}

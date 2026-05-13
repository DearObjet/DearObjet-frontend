export interface Reservation {
  reservationNumber: number;
  status: 'CONFIRMED' | 'CANCELED' | 'PENDING';
  reserverName: string;
  phoneNumber: string;
  usageDateTime: string;
  className: string;
}

export interface ReservationListResponse {
  reservationCount: number;
  items: Reservation[];
  page: number;
  totalPages: number;
}

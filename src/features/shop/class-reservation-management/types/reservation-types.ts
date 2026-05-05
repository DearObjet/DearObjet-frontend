export interface Reservation {
  reservationId: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  reservationName: string;
  phoneNumber: string;
  reservationTime: string;
  className: string;
  guestCount: number;
  memo: string;
}

export interface ReservationListResponse {
  reservationCount: number;
  reservations: Reservation[];
}

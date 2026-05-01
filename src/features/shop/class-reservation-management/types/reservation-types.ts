export interface Reservation {
  id: string;
  status: '확정' | '취소' | '대기';
  name: string;
  phone: string;
  reservationNumber: string;
  datetime: string;
  className: string;
  headcount: number;
  memo: string;
}

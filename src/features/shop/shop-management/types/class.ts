export interface CreateClassRequest {
  className: string;
  classDescription: string;
  price: number;
  maxCapacity: number;
  notes: string;
  classImageFiles?: File[];
}

export interface CreateClassResponse {
  data: {
    classId: number;
    className: string;
    classDescription: string;
    classImageUrls: string[];
    price: number;
    maxCapacity: number;
    notes: string;
  };
}

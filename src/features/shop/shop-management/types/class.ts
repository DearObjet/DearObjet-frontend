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

export interface ClassListItem {
  classId: number;
  className: string;
  firstImageUrl: string;
  maxCapacity: number;
}

export interface ClassListResponse {
  data: {
    items: ClassListItem[];
    page: number;
    totalPages: number;
  };
}

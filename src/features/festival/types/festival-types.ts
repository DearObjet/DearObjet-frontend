export interface FestivalItem {
  contentid: string;
  title: string;
  addr1: string;
  firstimage: string;
  firstimage2: string;
  eventstartdate: string;
  eventenddate: string;
  areacode: string;
}

export interface FestivalApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: FestivalItem[];
      };
      totalCount: number;
      numOfRows: number;
      pageNo: number;
    };
  };
}

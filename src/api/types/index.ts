export type BaseResponseModel<T = any> = {
  code: number;
  message: string;
  result: T;
}

export type BasePageParams = {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export type RecordListResponseModel = {
  page_count: number;
  list: Array<RecordModel>;
}

export type RecordModel = {
  id: number;
  name?: string;
  items_count?: number;
}

import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getFaceIDLabelList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/faceid/label/list',
    method: 'get',
    params,
  });
}

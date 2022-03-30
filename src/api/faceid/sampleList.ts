import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getFaceIDSampleList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/faceid/sample/list',
    method: 'get',
    params,
  });
}

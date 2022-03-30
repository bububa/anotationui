import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getHandPoseSampleList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/handpose/sample/list',
    method: 'get',
    params,
  });
}

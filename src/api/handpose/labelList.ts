import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getHandPoseLabelList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/handpose/label/list',
    method: 'get',
    params,
  });
}

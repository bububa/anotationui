import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getHandGuestureSampleList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/handguestue/sample/list',
    method: 'get',
    params,
  });
}

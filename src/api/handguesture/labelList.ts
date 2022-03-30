import http from '@/utils/http/axios';
import { RecordListResponseModel } from '@/api/types';

export function getHandGuestureLabelList(params: any) {
  return http.request<RecordListResponseModel>({
    url: '/handguesture/label/list',
    method: 'get',
    params,
  });
}

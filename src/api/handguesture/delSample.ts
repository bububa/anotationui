import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delHandGuestureSample(params: any) {
  return http.request<RecordModel>({
    url: '/handguesture/sample/del',
    method: 'post',
    params,
  })
}

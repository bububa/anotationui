import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delHandPoseSample(params: any) {
  return http.request<RecordModel>({
    url: '/handpose/sample/del',
    method: 'post',
    params,
  })
}

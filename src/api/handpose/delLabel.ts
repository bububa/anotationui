import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delHandPoseLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handpose/label/del',
    method: 'post',
    params,
  })
}

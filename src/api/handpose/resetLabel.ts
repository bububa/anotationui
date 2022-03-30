import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function resetHandPoseLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handpose/label/reset',
    method: 'post',
    params,
  })
}

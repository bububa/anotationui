import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function addHandPoseLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handpose/label/add',
    method: 'post',
    params,
  })
}

import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function updateFaceIDLabel(params: any) {
  return http.request<RecordModel>({
    url: '/faceid/label/update',
    method: 'post',
    params,
  })
}

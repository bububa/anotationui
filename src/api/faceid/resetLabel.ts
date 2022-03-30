import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function resetFaceIDLabel(params: any) {
  return http.request<RecordModel>({
    url: '/faceid/label/reset',
    method: 'post',
    params,
  })
}

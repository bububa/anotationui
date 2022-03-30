import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function addFaceIDLabel(params: any) {
  return http.request<RecordModel>({
    url: '/faceid/label/add',
    method: 'post',
    params,
  })
}

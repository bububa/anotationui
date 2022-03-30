import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delFaceIDLabel(params: any) {
  return http.request<RecordModel>({
    url: '/faceid/label/del',
    method: 'post',
    params,
  })
}

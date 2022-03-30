import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delFaceIDSample(params: any) {
  return http.request<RecordModel>({
    url: '/faceid/sample/del',
    method: 'post',
    params,
  })
}

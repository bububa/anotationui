import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function getFaceIDLabelInfo(id: number) {
  return http.request<RecordModel>({
    url: '/faceid/label/' + id,
    method: 'get',
  });
}

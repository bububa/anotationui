import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function getHandPoseLabelInfo(id: number) {
  return http.request<RecordModel>({
    url: '/handpose/label/' + id,
    method: 'get',
  });
}

import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function getHandGuestureLabelInfo(id: number) {
  return http.request<RecordModel>({
    url: '/handguesture/label/' + id,
    method: 'get',
  });
}

import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function updateHandGuestureLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handguesture/label/update',
    method: 'post',
    params,
  })
}

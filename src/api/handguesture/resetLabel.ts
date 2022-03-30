import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function resetHandGuestureLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handguesture/label/reset',
    method: 'post',
    params,
  })
}

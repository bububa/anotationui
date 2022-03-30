import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function delHandGuestureLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handguesture/label/del',
    method: 'post',
    params,
  })
}

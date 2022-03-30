import http from '@/utils/http/axios';
import { RecordModel } from '@/api/types';

export function addHandGuestureLabel(params: any) {
  return http.request<RecordModel>({
    url: '/handguesture/label/add',
    method: 'post',
    params,
  })
}

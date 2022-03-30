import http from '@/utils/http/axios';

export function classifyHandGuestureCamera() {
  return http.request({
    url: '/handguesture/classify/camera',
    method: 'post',
  })
}

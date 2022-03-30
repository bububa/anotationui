import http from '@/utils/http/axios';

export function trainHandGuesture() {
  return http.request({
    url: '/handguesture/train',
    method: 'post',
  })
}

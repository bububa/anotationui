import http from '@/utils/http/axios';

export function trainHandPose() {
  return http.request({
    url: '/handpose/train',
    method: 'post',
  })
}

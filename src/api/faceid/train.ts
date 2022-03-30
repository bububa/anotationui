import http from '@/utils/http/axios';

export function trainFaceID() {
  return http.request({
    url: '/faceid/train',
    method: 'post',
  })
}

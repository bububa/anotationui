import http from '@/utils/http/axios';

export function cameraReset() {
  return http.request({
    url: '/camera/reset',
    method: 'post',
  })
}

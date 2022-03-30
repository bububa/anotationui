import http from '@/utils/http/axios';

export function cameraClose() {
  return http.request({
    url: '/camera/close',
    method: 'get',
  })
}

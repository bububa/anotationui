import http from '@/utils/http/axios';

export function cameraStart() {
  return http.request({
    url: '/camera/start',
    method: 'get',
  })
}

import http from '@/utils/http/axios';

export function sampleFaceIDCamera(params: any) {
  return http.request({
    url: '/faceid/sample/camera',
    method: 'post',
    params,
  })
}

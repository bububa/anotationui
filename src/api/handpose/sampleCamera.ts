import http from '@/utils/http/axios';

export function sampleHandPoseCamera(params: any) {
  return http.request({
    url: '/handpose/sample/camera',
    method: 'post',
    params,
  })
}

import http from '@/utils/http/axios';

export function classifyHandPoseImage(params: any) {
  return http.request({
    url: '/handpose/classify/image',
    method: 'post',
    params,
  })
}

export function classifyHandPoseCamera() {
  return http.request({
    url: '/handpose/classify/camera',
    method: 'post',
  })
}

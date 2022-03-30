import http from '@/utils/http/axios';

export function classifyFaceIDImage(params: any) {
  return http.request({
    url: '/faceid/classify/image',
    method: 'post',
    params,
  })
}

export function classifyFaceIDCamera() {
  return http.request({
    url: '/faceid/classify/camera',
    method: 'post',
  })
}

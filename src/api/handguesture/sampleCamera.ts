import http from '@/utils/http/axios';

export function sampleHandGuestureCamera(params: any) {
  return http.request({
    url: '/handguesture/sample/camera',
    method: 'post',
    params,
  })
}

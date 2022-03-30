export function faceIDSampleImageLink(labelID: number, sampleID: number): string {
  return `/api/faceid/sample/image/${labelID}/${sampleID}`
}

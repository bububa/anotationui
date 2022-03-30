export function handPoseSampleImageLink(labelID: number, sampleID: number): string {
  return `/api/handpose/sample/image/${labelID}/${sampleID}`
}

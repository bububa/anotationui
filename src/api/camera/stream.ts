export function cameraStreamLink(delay?: number): string {
  if (!delay) {
    return `/api/camera/stream`
  }
  return `/api/camera/stream?delay=${delay}`
}

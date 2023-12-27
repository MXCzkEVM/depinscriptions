export function noop(): any {}

export function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export function ejectBlankPage(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}

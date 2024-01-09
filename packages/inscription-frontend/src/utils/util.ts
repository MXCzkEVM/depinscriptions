import { latLngToCell } from 'h3-js'

export function noop(): any {}

export async function getCurrentHexagon() {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  return latLngToCell(
    position.coords.latitude,
    position.coords.longitude,
    7,
  )
}

export function ejectBlankPage(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}

export function waitForElement(selector: string, timeout = 3000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)

    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(selector)
      if (targetElement) {
        resolve(targetElement)
        observer.disconnect()
      }
    })

    observer.observe(document.documentElement, { childList: true, subtree: true })
    setTimeout(reject, timeout)
  })
}

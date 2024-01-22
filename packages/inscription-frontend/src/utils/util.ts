import { latLngToCell } from 'h3-js'
import hexagons from './hexagons.json'

export function noop(): any {}

export async function getCurrentHexagon() {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return latLngToCell(
      position.coords.latitude,
      position.coords.longitude,
      7,
    )
  }
  catch (error) {
    return hexagons[Math.floor(Math.random() * hexagons.length)]
  }
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

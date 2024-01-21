import { latLngToCell } from 'h3-js'

export function noop(): any {}

export async function getCurrentHexagon() {
  let [latitude, longitude] = generateRandomCoordinates()
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    latitude = position.coords.latitude
    longitude = position.coords.longitude
  }
  catch (error) {}
  return latLngToCell(
    latitude,
    longitude,
    7,
  )
}

export function generateRandomCoordinates() {
  // 生成随机的经度（longitude）
  const longitude = (Math.random() * 360) - 180
  // 生成随机的纬度（latitude）
  const latitude = (Math.random() * 180) - 90

  // 返回经度和纬度的对象
  return [longitude, latitude] as const
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

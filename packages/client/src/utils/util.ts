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

import { Dropdown } from 'flowbite-react'
import { Language } from '@ricons/ionicons5'
import { LOCALE_TEXTS } from '@/config'
import { i18n } from '@/plugins'
import { Icon } from '@/components'

const locales = Object.keys(LOCALE_TEXTS).map(key => ({ value: key, label: LOCALE_TEXTS[key] }))

function LocaleButton() {
  function changeLocal(value: string) {
    i18n.changeLanguage(value)
  }
  function renderTrigger() {
    return (
      <button className="cursor-pointer inline-flex items-center rounded-lg p-2 text-sm text-[hsla(0,0%,100%,.6)] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ">
        <Icon size={24}>
          <Language />
        </Icon>
      </button>
    )
  }

  return (
    <>
      <Dropdown label="Language" renderTrigger={() => renderTrigger()}>
        {locales.map(({ label, value }) => (
          <Dropdown.Item key={value} onClick={() => changeLocal(value)}>
            {label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </>
  )
}

export default LocaleButton

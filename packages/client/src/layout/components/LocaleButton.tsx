import { Dropdown } from 'flowbite-react'
import { Language } from '@ricons/ionicons5'
import { useTranslation } from 'react-i18next'
import { LOCALE_TEXTS } from '@/config'
import { i18n } from '@/plugins'
import { Icon } from '@/components'

const locales = Object.keys(LOCALE_TEXTS).map(key => ({ value: key, label: LOCALE_TEXTS[key] }))

function LocaleButton(props: { type?: 'text' | 'icon' }) {
  const { t } = useTranslation()
  function changeLocal(value: string) {
    i18n.changeLanguage(value)
  }
  function renderTriggerIcon() {
    return (
      <button className="cursor-pointer inline-flex items-center rounded-lg p-2 text-sm text-[hsla(0,0%,100%,.6)] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ">
        <Icon size={24}>
          <Language />
        </Icon>
      </button>
    )
  }
  function renderTriggerText() {
    return (
      <span className="text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white">
        {t('Language')}
      </span>
    )
  }

  return (
    <>
      <Dropdown label="Language" renderTrigger={() => props.type === 'text' ? renderTriggerText() : renderTriggerIcon()}>
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

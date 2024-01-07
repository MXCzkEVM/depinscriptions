import { Menu, MenuItem } from '@mui/material'
import { Language as IconLanguage } from '@ricons/ionicons5'
import classNames from 'classnames'
import { useState } from 'react'
import { LOCALE_TEXTS } from '@/config'
import { i18n } from '@/plugins'
import { Icon } from '@/components'

const locales = Object.keys(LOCALE_TEXTS).map(key => ({ value: key, label: LOCALE_TEXTS[key] }))

function Language(props: { type?: 'text' | 'icon', className?: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  function changeLocal(value: string) {
    i18n.changeLanguage(value)
    setAnchorEl(null)
  }

  return (
    <>
      <button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className={classNames([
          'cursor-pointer inline-flex items-center',
          'rounded-lg p-2 text-sm text-[hsla(0,0%,100%,.6)]',
          'focus:outline-none focus:ring-2 focus:ring-gray-200',
          'dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
          props.className,
        ])}
      >
        <Icon size={24}>
          <IconLanguage />
        </Icon>
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {locales.map(({ label, value }) => (
          <MenuItem key={value} onClick={() => changeLocal(value)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default Language

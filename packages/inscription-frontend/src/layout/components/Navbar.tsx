import React, { HTMLAttributes, MouseEvent } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Navbar } from 'flowbite-react/lib/cjs/components/Navbar/Navbar'
import { useNavbarContext } from 'flowbite-react/lib/cjs/components/Navbar/NavbarContext'
import classNames from 'classnames'
import Language from './Language'
import { useEventBus } from '@/hooks'

const CollapseSource = Navbar.Collapse
Navbar.Locale = Language
Navbar.Item = NavbarItem
Navbar.Collapse = NavbarCollapse

const LayoutNavbar: React.FC = () => {
  const { emit: reloadGuide } = useEventBus('reload:guide')
  const { setIsOpen } = useNavbarContext()
  const { t } = useTranslation()

  useEventBus('setter:setNavbarIsOpen').on(setIsOpen)
  return (
    <>
      <Navbar.Brand href="/">
        <img className="h-[38px] sm:h-[43px]" src="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/6287440e15c1ce566364ee5c_mxc-mini-version (1).svg " alt="" />
        <span className="hidden sm:inline-block ml-2 font-bold text-base md:text-lg mr-6">DePINscription</span>
      </Navbar.Brand>
      <div className="flex gap-2 md:order-2">
        <div className="scale-[0.85] -mx-2 md:mx-0 ml-6 md:scale-90">
          <ConnectButton showBalance={true} accountStatus="full" />
        </div>
        <Navbar.Toggle className="root_step_1 scale-[0.85] sm:scale-100 text-[rgba(255,255,255,0.6)] hover:bg-transparent" />
        <Navbar.Locale className="scale-[0.85] sm:scale-100" />
      </div>
      <div className="hidden md:block flex-1"></div>
      <Navbar.Collapse>
        <Navbar.Item className="root_step-1_5" path="/">{t('DePINscriptions')}</Navbar.Item>
        <Navbar.Item className="root_step_2" path="/tokens?tab=all">{t('Token')}</Navbar.Item>
        <Navbar.Item className="root_step_3" path="/personal">{t('Wallet')}</Navbar.Item>
        <Navbar.Item className="root_step_4" path="/market">{t('Marketplace')}</Navbar.Item>
        <Navbar.Item className="root_step_4" onClick={reloadGuide}>{t('Tutorial')}</Navbar.Item>
      </Navbar.Collapse>
    </>
  )
}

function NavbarCollapse(props: any) {
  return (
    <CollapseSource className="mr-0 md:mr-6">
      <div className="flex gap-3 text-sm flex-col sm:flex-row lg:gap-6 lg:text-lg">
        {props.children}
      </div>
    </CollapseSource>
  )
}

function NavbarItem(props: HTMLAttributes<HTMLDivElement> & { path?: string }) {
  const { setIsOpen } = useNavbarContext()
  const router = useRouter()
  function onClick(event: any) {
    props.onClick?.(event)
    if (props.path)
      router.push(props.path)
    if (!props.onClick)
      setIsOpen(false)
  }
  return (
    <div className={classNames(['cursor-pointer px-2 md:px-0 text-[hsla(0,0%,100%,.6)] hover:text-white', props.className])} onClick={onClick}>
      {props.children}
    </div>
  )
}

export default LayoutNavbar

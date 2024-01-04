import React, { useEffect, useRef } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'react-use'
import { Navbar } from 'flowbite-react/lib/cjs/components/Navbar/Navbar'
import { useNavbarContext } from 'flowbite-react/lib/cjs/components/Navbar/NavbarContext'
import Language from './Language'
import { useEventBus } from '@/hooks'

Navbar.Locale = Language

const LayoutNavbar: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const { setIsOpen } = useNavbarContext()
  const { emit: reloadGuide } = useEventBus('reload:guide')

  useEventBus('setter:setNavbarIsOpen').on(setIsOpen)

  return (
    <>
      <Navbar.Brand href="/">
        <img className="h-[38px] sm:h-[43px]" src="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/6287440e15c1ce566364ee5c_mxc-mini-version (1).svg " alt="" />
        <span className="ml-2 font-bold text-base sm:text-lg">DePINscription</span>
      </Navbar.Brand>
      <div className="ml-6 flex gap-2 md:order-2">
        <div className="scale-[0.85] -mx-2 md:mx-0 md:scale-90">
          <ConnectButton showBalance={true} accountStatus={width > 885 ? 'full' : 'avatar'} />
        </div>
        <Navbar.Toggle className="root_step_1 scale-[0.85] sm:scale-100 text-[rgba(255,255,255,0.6)] hover:bg-transparent" />
        <Navbar.Locale className="scale-[0.85] sm:scale-100" />
      </div>
      <div className="hidden md:block flex-1"></div>
      <Navbar.Collapse>
        <div className="root_step-1_5 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/`)}>{t('DePINscriptions')}</div>
        <div className="root_step_2 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/tokens?tab=all`)}>{t('Token')}</div>
        <div className="root_step_3 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/personal`)}>{t('Wallet')}</div>
        <div className="root_step_4 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/market`)}>{t('Marketplace')}</div>
        <div className="root_step_4 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={reloadGuide}>{t('Tutorial')}</div>
      </Navbar.Collapse>
    </>
  )
}

export default LayoutNavbar

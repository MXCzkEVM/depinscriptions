import { Navbar } from 'flowbite-react'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'react-use'
import LocaleButton from './LocaleButton'

const LayoutNavbar: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  return (
    <Navbar className="relative top-0 bg-transparent" fluid={true} rounded={true}>
      <Navbar.Brand href="/">
        <img className="h-[38px] sm:h-[43px]" src="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/6287440e15c1ce566364ee5c_mxc-mini-version (1).svg " alt="" />
        <span className="ml-2 font-bold text-base sm:text-lg">DePINscription</span>
      </Navbar.Brand>
      <div className="ml-6 flex gap-2 md:order-2">
        <div className="scale-[0.85] -mx-2 md:mx-0 md:scale-90">
          <ConnectButton showBalance={true} accountStatus={width > 885 ? 'full' : false as any} />
        </div>
        <div className="scale-[0.85] sm:scale-100">
          <Navbar.Toggle className="text-[rgba(255,255,255,0.6)] hover:bg-transparent" />
        </div>
        <span className="hidden md:inline-block">
          <LocaleButton />
        </span>
      </div>
      <div className="hidden md:block flex-1"></div>
      <Navbar.Collapse>
        <div className="text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/`)}>{t('DePINscriptions')}</div>
        <div className="text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/tokens`)}>{t('Token')}</div>
        <div className="text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/personal`)}>{t('Wallet')}</div>
        <div className="text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/market`)}>{t('Marketplace')}</div>

        <div className="inline-block md:hidden"><LocaleButton type="text" /></div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LayoutNavbar

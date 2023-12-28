import React, { useEffect, useRef } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'react-use'
import { Navbar } from 'flowbite-react/lib/cjs/components/Navbar/Navbar'
import { useNavbarContext } from 'flowbite-react/lib/cjs/components/Navbar/NavbarContext'
import { delay } from '@hairy/utils'
import { Step } from 'react-joyride'
import LocaleButton from './LocaleButton'
import GuidePage, { GuidePageRef, Trigger } from '@/components/GuidePage'
import { useGlobalPersonalExample, useMittEmit } from '@/hooks'

Navbar.Locale = LocaleButton

type GuidePageOptions = Record<string, {
  steps: Step[]
  triggers?: Record<any, Trigger>
  onFinish?: () => void
}>

const LayoutNavbar: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const { isOpen, setIsOpen } = useNavbarContext()
  const isMobile = width < 768

  const [_, setShowExample] = useGlobalPersonalExample()
  const openDeployDialog = useMittEmit('inscription:deploy-open')
  const cancelDeployDialog = useMittEmit('inscription:deploy-cancel')
  const options: GuidePageOptions = {
    '/': {
      steps: [
        ...(isMobile
          ? [{
              target: '.root_step_1',
              content: t('root_step_1'),
              disableBeacon: true,
            }]
          : []),
        {
          target: '.root_step-1_5',
          content: t('root_step_1_5'),
          disableBeacon: !isMobile,
        },
        {
          target: '.root_step_2',
          content: t('root_step_2'),
        },
        {
          target: '.root_step_3',
          content: t('root_step_3'),
        },
        {
          target: '.root_step_4',
          content: t('root_step_4'),
        },
      ],
      triggers: {
        '.root_step_1': {
          invoke: () => setIsOpen(true),
          cond: () => router.pathname === '/' && isOpen,
        },
      },
      onFinish: () => {
        window.scrollTo({ top: 0 })
        setIsOpen(false)
      },
    },
    '/tokens': {
      steps: [
        {
          target: '.token_page_step_0_5',
          content: t('token_page_step_0_5'),
          disableBeacon: true,
        },
        {
          target: '.token_page_step_1',
          content: t('token_page_step_1'),
          disableBeacon: true,
        },
        {
          target: '.token_page_step_2',
          content: t('token_page_step_2'),
        },
        {
          target: '.token_page_step_3',
          content: t('token_page_step_3'),
        },
        {
          target: '.token_page_step_4',
          content: t('token_page_step_4'),
        },
        {
          target: '.token_page_step_5',
          content: t('token_page_step_5'),
        },
      ],
      triggers: {
        '.token_page_step_2': {
          invoke: () => {
            openDeployDialog()
            return delay(500)
          },
          unvoke: () => cancelDeployDialog(),
        },
      },
      onFinish: () => {
        window.scrollTo({ top: 0 })
        cancelDeployDialog()
      },
    },
    '/tokens/detail': {
      steps: [
        {
          target: '.token_detail_page_step_1',
          content: t('tokens_detail_page_step_1'),
          disableBeacon: true,
        },
      ],
    },
    '/personal': {
      steps: [
        {
          target: '.personal_page_step_1',
          content: t('personal_page_step_1'),
          disableBeacon: true,
        },
        {
          target: '.personal_page_step_2',
          content: t('personal_page_step_2'),
          disableBeacon: true,
        },
        {
          target: '.personal_page_step_3',
          content: t('personal_page_step_3'),
          disableBeacon: true,
        },
      ],
      triggers: {
        '.personal_page_step_1': {
          invoke: () => setShowExample(true),
          unvoke: () => setShowExample(false),
          // cond: () => showExample,
        },
      },
      onFinish: () => {
        window.scrollTo({ top: 0 })
        setShowExample(false)
      },
    },
  }

  const guideRef = useRef<GuidePageRef>()

  useEffect(() => {
    if (!some(`[page-guide]:[${router.pathname}]`))
      delay(1000).then(() => guideRef.current?.load())
  }, [router.pathname])

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
        <GuidePage
          ref={guideRef}
          triggers={options[router.pathname]?.triggers}
          steps={options[router.pathname]?.steps}
          onFinish={options[router.pathname]?.onFinish}
        />
      </div>
      <div className="hidden md:block flex-1"></div>
      <Navbar.Collapse>
        <div className="root_step-1_5 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/`)}>{t('DePINscriptions')}</div>
        <div className="root_step_2 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/tokens`)}>{t('Token')}</div>
        <div className="root_step_3 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/personal`)}>{t('Wallet')}</div>
        <div className="root_step_4 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => router.push(`/market`)}>{t('Marketplace')}</div>
        <div className="root_step_4 text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white" onClick={() => guideRef.current?.load()}>{t('Tutorial')}</div>
      </Navbar.Collapse>
    </>
  )
}

function some(key: string) {
  if (localStorage.getItem(key))
    return true
  localStorage.setItem(key, 'done')
  return false
}

export default LayoutNavbar

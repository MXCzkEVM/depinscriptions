import { Step } from 'react-joyride'
import { useWindowSize } from 'react-use'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { delay } from '@hairy/utils'
import ReactJoyride, { JoyrideRef, JoyrideTrigger } from '@/components/ReactJoyride'
import { useEventBus } from '@/hooks'
import { useWhenever } from '@/hooks/useWhenever'

type GuideOptions = Record<string, {
  steps: Step[]
  triggers?: Record<any, JoyrideTrigger>
  onFinish?: () => void
}>

function GuidePage() {
  const { emit: openDeployDialog } = useEventBus('dialog:deploy')
  const { emit: cancelDeployDialog } = useEventBus('dialog:cancel')
  const { emit: setNavbarIsOpen } = useEventBus<boolean>('setter:setNavbarIsOpen')
  const { emit: setShowPersonalExample } = useEventBus<boolean>('setter:setShowPersonalExample')

  const { width } = useWindowSize()
  const { t } = useTranslation()
  const router = useRouter()
  const joyrideRef = useRef<JoyrideRef>()

  const options: GuideOptions = {
    '/': {
      steps: [
        ...(width < 768
          ? [{
              target: '.root_step_1',
              content: t('root_step_1'),
              disableBeacon: true,
            }]
          : []),
        {
          target: '.root_step-1_5',
          content: t('root_step_1_5'),
          disableBeacon: width > 768,
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
          invoke: () => setNavbarIsOpen(true),
          unvoke: () => setNavbarIsOpen(false),
        },
      },
      onFinish: () => {
        window.scrollTo({ top: 0 })
        setNavbarIsOpen(false)
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
          invoke: () => setShowPersonalExample(true),
          unvoke: () => setShowPersonalExample(false),
        },
      },
      onFinish: () => {
        window.scrollTo({ top: 0 })
        setShowPersonalExample(false)
      },
    },
  }

  function initLoadGuide() {
    if (!some(`[page-guide]:[${router.pathname}]`))
      delay(1000).then(() => joyrideRef.current?.load())
  }
  function reloadGuide() {
    joyrideRef.current?.reload()
  }

  useEventBus('reload:guide').on(reloadGuide)
  useWhenever(router.pathname, initLoadGuide)
  return (
    <ReactJoyride
      ref={joyrideRef}
      triggers={options[router.pathname]?.triggers}
      steps={options[router.pathname]?.steps}
      onFinish={options[router.pathname]?.onFinish}
    />
  )
}

function some(key: string) {
  if (localStorage.getItem(key))
    return true
  localStorage.setItem(key, 'done')
  return false
}

export default GuidePage

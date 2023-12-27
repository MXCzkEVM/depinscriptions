import { Navbar } from 'flowbite-react/lib/cjs/components/Navbar/Navbar'
import { useNavbarContext } from 'flowbite-react/lib/cjs/components/Navbar/NavbarContext'

import { useRef, useState } from 'react'
import ReactJoyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride'
import { useMount, useWindowSize } from 'react-use'
import { useTranslation } from 'react-i18next'
import { useWhenever } from '@/hooks/useWhenever'
import { useMittOn } from '@/hooks'

export function NavbarToggle() {
  const { isOpen, setIsOpen } = useNavbarContext()
  const locked = useRef(false)
  const { width } = useWindowSize()
  const { t } = useTranslation()

  const steps = [
    width < 768
      ? {
          target: '.root-step-1',
          content: t('root_step_1'),
          disableBeacon: true,
        }
      : undefined,
    {
      target: '.root-step-1_5',
      content: t('root_step_1_5'),
      disableBeacon: width > 768,
    },
    {
      target: '.root-step-2',
      content: t('root_step_2'),
    },
    {
      target: '.root-step-3',
      content: t('root_step_3'),
    },
    {
      target: '.root-step-4',
      content: t('root_step_4'),
    },
  ]
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  function onJoyrideCallback(data: CallBackProps) {
    const { action, index, status, type } = data
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type as any)) {
      // Update state to advance the tour
      if (index === 0 && width < 768 && !isOpen)
        setIsOpen(true)
      else
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }
    else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false)
      setIsOpen(false)
      window.scrollTo({ top: 0 })
      locked.current = true
    }
  }
  useMittOn('reshow:joyride', () => {
    locked.current = false
    setStepIndex(0)
    setRun(true)
  })

  useWhenever(isOpen, () => {
    if (!locked.current && run !== false)
      setStepIndex(1)
  })
  useMount(() => {
    if (!localStorage.getItem('joyrideShowRoot')) {
      localStorage.setItem('joyrideShowRoot', 'run')
      setRun(true)
    }
  })
  return (
    <>
      <ReactJoyride
        styles={{ options: { primaryColor: '#6300ff', backgroundColor: '#121212', arrowColor: '#383838' } }}
        run={run}
        stepIndex={stepIndex}
        callback={onJoyrideCallback}
        showProgress
        continuous={true}
        hideCloseButton
        steps={steps.filter(Boolean) as any}
        locale={{
          back: t('Back'),
          next: t('Next'),
          skip: t('Skip'),
        }}
      />
      <Navbar.Toggle className="text-[rgba(255,255,255,0.6)] hover:bg-transparent" />
    </>
  )
}

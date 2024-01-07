/* eslint-disable ts/ban-ts-comment */
/* eslint-disable react/display-name */
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import BaseReactJoyride, { ACTIONS, EVENTS, Props, STATUS, Step, CallBackProps as _CallBackProps } from 'react-joyride'
import { useSetState } from 'react-use'

export interface JoyrideRef {
  reload: () => void
  load: () => void
  // TODO
  next: () => void
  prev: () => void
  skip: () => void
}

export interface JoyrideTrigger {
  unvoke?: (data: JoyrideCallBackProps) => void | Promise<void>
  invoke?: (data: JoyrideCallBackProps) => void | Promise<void>
  cond?: () => boolean | Promise<boolean>
}

export interface JoyrideCallBackProps extends Omit<_CallBackProps, 'step'> {
  step: Step
  force?: boolean
}

export interface ReactJoyrideProps extends Omit<Props, 'run'> {
  triggers?: Record<any, JoyrideTrigger>
  onFinish?: (data: JoyrideCallBackProps) => void
  run?: boolean
}

export const ReactJoyride = forwardRef((props: ReactJoyrideProps, ref) => {
  const { t } = useTranslation()

  const processing = useRef<Record<string, JoyrideCallBackProps>>({})
  const [{ index, run }, setState] = useSetState({
    index: 0,
    run: false,
  })

  function load() {
    if (!props.steps?.length)
      return
    setState({ run: true })
  }
  function reload() {
    if (!props.steps?.length)
      return
    setState({ run: true, index: 0 })
  }
  function findTrigger(step?: Step) {
    if (!step)
      return
    const target = step?.target as string
    return props.triggers?.[target]
  }

  async function onJoyrideCallback(data: JoyrideCallBackProps) {
    const { action, status, type, index, step } = data

    const prevTrigger = findTrigger(props.steps?.[index - 1])
    const currTrigger = findTrigger(step)
    const isPREV = action === ACTIONS.PREV
    const trigger = isPREV ? prevTrigger : currTrigger
    const cond = isPREV
      ? (trigger?.unvoke && trigger?.cond?.() || undefined)
      : trigger?.cond?.()
    const isExistTarget = !!document.querySelector(step.target as string)

    // @ts-expect-error
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      if (data.force || cond === true || !trigger)
        return setState({ index: index + (isPREV ? -1 : 1) })
      isPREV
        ? await trigger?.unvoke?.(data)
        : await trigger?.invoke?.(data)
      if (cond === undefined)
        onJoyrideCallback({ ...data, force: true })
      else
        processing.current[step.target as string] = data
    }
    // @ts-expect-error
    else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setState({ run: false })
      props.onFinish?.(data)
    }
    // @ts-expect-error
    else if ([EVENTS.TOUR_START, EVENTS.TOUR_STATUS].includes(type) && !isExistTarget) {
      await trigger?.invoke?.(data)
      onJoyrideCallback({ ...data, lifecycle: 'ready', type: 'step:before', force: true })
    }
    else if (type === EVENTS.STEP_BEFORE && isExistTarget && data.force) {
      setState({ index: 0, run: true })
    }
  }

  useEffect(() => {
    (async () => {
      const target = props.steps?.[index]?.target as string
      if (!target || !processing.current[target])
        return
      const trigger = props.triggers?.[target]
      if (await trigger?.cond?.()) {
        onJoyrideCallback({
          ...processing.current[target],
          force: true,
        })
        delete processing.current[target]
      }
    })()
  }, [props.triggers])

  useImperativeHandle(ref, () => ({
    load,
    reload,
  }))

  return (
    <>
      <BaseReactJoyride
        styles={{ options: { primaryColor: '#6300ff', backgroundColor: '#121212', arrowColor: '#383838', zIndex: 10000 } }}
        run={run}
        stepIndex={index}
        showProgress
        callback={onJoyrideCallback}
        hideCloseButton
        continuous={true}
        steps={props.steps}
        locale={{
          back: t('Back'),
          next: t('Next'),
          skip: t('Skip'),
          last: t('Finish'),
          close: t('Close'),
        }}
      />
    </>
  )
})

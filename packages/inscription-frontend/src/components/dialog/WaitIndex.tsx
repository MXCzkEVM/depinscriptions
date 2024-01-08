import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from '@mui/material'
import { useOverlay } from '@overlays/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInterval } from 'react-use'
import { Condition } from '../utils'
import { getInscriptionHashSome } from '@/api'

export interface WaitIndexDialogProps {
  hash: string
}
export function WaitIndexDialog(props: WaitIndexDialogProps) {
  const { visible, resolve, reject } = useOverlay({
    duration: 500,
  })
  const { t } = useTranslation()

  const [isIndexed, setIsIndexed] = useState(false)
  const [progress, setProgress] = useState(0)
  async function load() {
    if (isIndexed)
      return
    const { data } = await getInscriptionHashSome({ hash: props.hash })
    setIsIndexed(data)
    setProgress(100)
  }

  useInterval(load, 3000)

  return (
    <Dialog open={visible}>
      <DialogTitle id="alert-dialog-title" className="flex items-center gap-2">
        {
          isIndexed
            ? t('Successfully indexed')
            : t('Waiting for indexing')
        }
      </DialogTitle>
      <DialogContent className="max-w-[550px] md:min-w-[550px]">
        <DialogContentText id="alert-dialog-description" className="flex justify-center flex-col items-center">
          <Condition
            is={isIndexed}
            if={(
              <>
                <div className="text-center">{t('Indexing successful Dsc')}</div>
              </>
            )}
            else={(
              <>
                <div>{t('Indexing Progress Dsc')}</div>
                <div className="pt-8 w-full">
                  <LinearProgress value={progress} color="secondary" className="w-full" />
                </div>
              </>
            )}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Condition
          is={isIndexed}
          if={(
            <Button className="w-24" variant="contained" onClick={() => resolve()} autoFocus>
              {t('Confirm')}
            </Button>
          )}
          else={(
            <Button className="w-24" variant="contained" onClick={() => reject()} autoFocus>
              {t('Skip')}
            </Button>
          )}
        />
      </DialogActions>
    </Dialog>
  )
}

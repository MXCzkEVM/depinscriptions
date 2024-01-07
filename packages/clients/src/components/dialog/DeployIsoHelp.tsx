import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useOverlay } from '@overlays/react'

import { useTranslation } from 'react-i18next'

export function DeployIsoHelpDialog() {
  const { visible, resolve } = useOverlay({
    duration: 500,
  })
  const { t } = useTranslation()

  return (
    <Dialog
      aria-describedby="alert-dialog-slide-description"
      open={visible}
      keepMounted
      onClose={() => resolve()}
    >
      <DialogTitle>{t('ISO 3166-2 Code Overview')}</DialogTitle>
      <DialogContent>
        <DialogContentText className="flex flex-col gap-3" id="alert-dialog-slide-description">
          <div className="flex gap-1 flex-wrap">
            <span className="font-bold text-nowrap">
              {t('Global Standard Title')}
              :
              {' '}
            </span>
            <span>{t('Global Standard Help')}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="font-bold text-nowrap">
              {t('Inclusivity')}
              :
              {' '}
            </span>
            <span>{t('Inclusivity Help')}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="font-bold text-nowrap">
              {t('Purpose')}
              :
              {' '}
            </span>
            <span>{t('Purpose Help')}</span>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="contained" onClick={() => resolve()}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  )
}

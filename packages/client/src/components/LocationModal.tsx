import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useOverlay } from "@overlays/react"
import { useTranslation } from 'react-i18next';

function LocationModal() {
  const { t } = useTranslation()
  const { visible, resolve, reject } = useOverlay({
    duration: 500
  })
  return <Dialog open={visible} onClose={() => reject()}>
    <DialogTitle id="alert-dialog-title">
      {t('We Need Your Location')}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {t('Need Your Location Contnet')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => reject()}>
        {t('Cancel')}
      </Button>
      <Button onClick={() => resolve()} autoFocus>
        {t('Confirm')}
      </Button>
    </DialogActions>
  </Dialog>
}

export default LocationModal
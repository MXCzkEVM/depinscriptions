import { Button, OutlinedInput, Tooltip } from '@mui/material'
import { Calculator } from '@ricons/ionicons5'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Icon from './Icon'

interface ListDialogFillProps {
  onFill?: (value: string) => void
}

function ListDialogFill(props: ListDialogFillProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  return (
    <Tooltip
      open={open}
      title={(
        <div className="p-2">
          <div className="text-sm mb-2">{t('Amount calculated by mints')}</div>
          <div className="flex gap-2">
            <OutlinedInput value={value} onChange={event => setValue(event.target.value)} className="h-8" size="small" />
            <Button
              onClick={() => {
                props.onFill?.(value)
                setValue('')
                setOpen(false)
              }}
              variant="contained"
              size="small"
            >
              Fill

            </Button>
          </div>
        </div>
      )}
      placement="top"
    >
      <Icon onClick={() => setOpen(true)} tag="button" className="cursor-pointer absolute -right-8 top-2">
        <Calculator />
      </Icon>
    </Tooltip>
  )
}

export default ListDialogFill

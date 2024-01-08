import { FormControlLabel, Switch as MSwitch } from '@mui/material'

export interface SwitchProps {
  checked?: boolean
  onChange?: (bool: boolean) => void
  label?: string
}
export function Switch(props: SwitchProps) {
  return (
    <FormControlLabel
      control={
        <MSwitch checked={props.checked} onChange={(_, value) => props.onChange?.(value)} />
      }
      label={props.label}
    />
  )
}

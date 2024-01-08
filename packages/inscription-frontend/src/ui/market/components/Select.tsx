import { FormControl, FormControlLabel, InputLabel, Select as MSelect, SelectProps as _SelectProps } from '@mui/material'

export interface SelectProps<V = unknown> extends Omit<_SelectProps<V>, 'onChange'> {
  onChange?: (value: any) => void
  label?: string
}

export function Select<T>(props: SelectProps<T>) {
  return (
    <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={`${props.id}__label`}>{props.label}</InputLabel>
      <MSelect
        {...props}
        multiple
        labelId={`${props.id}__label`}
        placeholder="all"
        value={props.value}
        onChange={event => props.onChange?.(event.target.value)}
        label={props.label}
      >
        {props.children}
      </MSelect>
    </FormControl>
  )
}

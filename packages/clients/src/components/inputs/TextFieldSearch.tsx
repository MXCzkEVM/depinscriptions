import { TextField, TextFieldProps } from '@mui/material'
import { MouseEventHandler } from 'react'
import { Search } from '@ricons/ionicons5'
import { Icon } from '../utils'

export type TextFieldSearchProps = TextFieldProps & {
  onSearch?: MouseEventHandler
}

export function TextFieldSearch(props: TextFieldSearchProps) {
  return (
    <div className="relative hidden md:block">
      <TextField
        color="secondary"
        size="small"
        variant="outlined"
        {...props}
      />
      <Icon className="absolute right-2 top-2 cursor-pointer" onClick={props.onSearch}>
        <Search />
      </Icon>
    </div>
  )
}

import { TextField } from '@mui/material'
import { Search } from '@ricons/ionicons5'
import { useTranslation } from 'react-i18next'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { Icon } from '../utils'

export interface TextFieldTickProps {
  onSearch?: (text: string) => void
  defaultValue?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function TextFieldTick(props: TextFieldTickProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  useEffect(() => {
    setValue(props.defaultValue || '')
  }, [props.defaultValue])
  return (
    <>
      <div className="mx-auto mt-6 mb-8 sm:mt-9 sm:mb-14 w-full text-center">

        <span className="text-2xl md:text-3xl text-center select-none text-[#6300ff]">
          {t('Check out msc-20 balance of the address')}
        </span>
      </div>
      <div className="flex justify-center">
        <div className="md:w-[672px] w-full relative">
          <TextField
            defaultValue={props.defaultValue}
            value={props.value || value}
            onChange={props.onChange || (event => setValue(event.target.value))}
            className="w-full"
            color="secondary"
            size="small"
            variant="outlined"
            placeholder="0x...5e0d7A"
          />
          <Icon className="absolute right-2 top-2 cursor-pointer" onClick={() => props.onSearch?.(value)}>
            <Search />
          </Icon>
        </div>
      </div>
      <div className="text-center my-6 sm:my-10 select-none">
        {' '}
        {t('Token List Desc')}
        {' '}
      </div>
    </>
  )
}

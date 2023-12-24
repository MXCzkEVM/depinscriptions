import { TextField } from '@mui/material'
import { Search } from '@ricons/ionicons5'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Icon from './Icon'

export interface FieldTickInputProps {
  onSearch?: (text: string) => void
}

function FieldTickInput(props: FieldTickInputProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  return (
    <>
      <div className="mx-auto mt-9 mb-14 w-full text-center">
        <span className="md:text-3xl text-center mt-[41px] mp:mb-[18px] select-none text-[#6300ff]">
          {' '}
          {t('Check out msc-20 balance of the address')}
          {' '}
        </span>
      </div>
      <div className="flex justify-center">
        <div className="md:w-[672px] w-full relative">
          <TextField value={value} onChange={event => setValue(event.target.value)} className="w-full" color="secondary" size="small" variant="outlined" placeholder="0x...5e0d7A" />
          <Icon className="absolute right-2 top-2 cursor-pointer" onClick={() => props.onSearch?.(value)}>
            <Search />
          </Icon>
        </div>
      </div>
      <div className="text-center my-10 select-none">
        {' '}
        {t('Token List Desc')}
        {' '}
      </div>
    </>
  )
}

export default FieldTickInput

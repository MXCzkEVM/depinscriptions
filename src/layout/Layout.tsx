import React from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import NoSSR from '@components/NoSSR'

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <NoSSR>
        <Navbar />
      </NoSSR>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
        {children}
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default Layout

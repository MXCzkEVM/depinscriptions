import React from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import { NoSSR } from '@/components'

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        <NoSSR>
          <Navbar />
        </NoSSR>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-8">
        {children}
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default Layout

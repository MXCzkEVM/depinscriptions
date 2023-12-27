import React from 'react'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { LogoTwitter } from '@ricons/ionicons5'
import Navbar from './components/Navbar'
import { Icon, NoSSR } from '@/components'

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-[1400px] mx-auto">
          <NoSSR>
            <Navbar />
          </NoSSR>
        </div>
        <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {children}
        </div>
        <div className="w-full mt-8 mb-6 py-8 flex gap-8 h-[24px] justify-center items-center text-[#ddd]">
          <Link className="underline -mt-1" color="inherit" href="https://www.mxc.org/axs-app">
            <img className="h-[28px]" src="https://assets-global.website-files.com/6253d5b96f29fe54ae351282/6287440e15c1ce566364ee5c_mxc-mini-version (1).svg " alt="" />
          </Link>
          <Link href="https://t.me/mxcfoundation">
            <Icon size={28}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38" /></svg>
            </Icon>
          </Link>
          <Link href="https://twitter.com/mxcfoundation">
            <Icon size={28} color="#1D9BF0">
              <LogoTwitter />
            </Icon>
          </Link>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  )
}

export default Layout

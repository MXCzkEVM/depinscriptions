/* eslint-disable @next/next/no-img-element */
import { Navbar } from 'flowbite-react'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import LocaleButton from './LocaleButton'

const LayoutNavbar: React.FC = () => {
  const router = useRouter()
  return (
    <Navbar className='relative top-0 bg-transparent' fluid={true} rounded={true}>
      <Navbar.Brand href="https://doc.mxc.com/">
        <img src="https://nft.mxc.com/mxc-logo.svg" alt="" />
      </Navbar.Brand>
      <div className="ml-6 flex gap-2 md:order-2">
        <div className='scale-90'>
          <ConnectButton />
        </div>
        <Navbar.Toggle className='text-[rgba(255,255,255,0.6)] hover:bg-transparent' />
        <LocaleButton />
      </div>
      <div className='hidden md:block flex-1'></div>
      
      <Navbar.Collapse>
        <div className='text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white' onClick={() => router.push(`/`)}>Home</div>
        <div className='text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white' onClick={() => router.push(`/tokens`)}>Tokens</div>
        <div className='text-[18px] cursor-pointer p-2 md:p-0 text-[hsla(0,0%,100%,.6)] hover:text-white' onClick={() => router.push(`/personal`)}>Personal</div>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LayoutNavbar

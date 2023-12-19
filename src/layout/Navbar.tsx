import { Navbar } from 'flowbite-react'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'

const LayoutNavbar: React.FC = () => {
  const router = useRouter()
  return (
    <Navbar className='border-b border-gray-3 relative top-0' fluid={true} rounded={true}>
      <Navbar.Brand className='flex-1' href="https://doc.mxc.com/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          MXC zkEVM
        </span>
      </Navbar.Brand>
      <div className="ml-6 flex gap-4 md:order-2">
        <div className='scale-90'>
          <ConnectButton />
        </div>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link className='cursor-pointer' onClick={() => router.push(`/`)}>Home</Navbar.Link>
        <Navbar.Link className='cursor-pointer' onClick={() => router.push(`/tokens`)}>Tokens</Navbar.Link>
        <Navbar.Link className='cursor-pointer' onClick={() => router.push(`/personal`)}>Personal</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LayoutNavbar

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'react-i18next'

function PleaseConnectWallet() {
  const { t } = useTranslation()
  return (
    <div className="bg-[rgb(42, 15, 105)] py-24 sm:py-32 lg:py-40 h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-indigo-600">
            {t('Please connect your wallet')}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('A better way to msc20 tokens')}
          </p>
          <div className="flex flex-col items-center mt-6 text-lg leading-8 text-white">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PleaseConnectWallet

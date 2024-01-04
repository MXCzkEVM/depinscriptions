import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import { ethers, getNamedAccounts, upgrades } from 'hardhat'

async function main() {
  const Market = await ethers.getContractFactory('MscMarketV1')
  console.log('正在发布 MSCMarket...')

  const options: DeployProxyOptions = {
    initializer: 'initialize',
    kind: 'uups',
  }
  const { owner } = await getNamedAccounts()

  const proxy = await upgrades.deployProxy(Market, [owner, 4], options)

  console.log('代理合约地址: ', proxy.target)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

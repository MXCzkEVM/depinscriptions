import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import { ethers, upgrades } from 'hardhat'

const options: DeployProxyOptions = {
  initializer: 'initialize',
  kind: 'uups',
}
describe('MSC20Market', () => {
  it('should return the sum of two numbers', async () => {
    const Market = await ethers.getContractFactory('MSC20Market')

    const market = await upgrades.deployProxy(Market, ['0x8808D84e7c7d0221fFa4474a2Bc56d3eA0555e26', '0x8808D84e7c7d0221fFa4474a2Bc56d3eA0555e26', 2], options)
    // {
    //   message: '0x8a1a4362b6f84d6f41d180086cd67c7fea14191b51e43c6fbe8f56f3a05cc81f2babeeff7e6dfc64ebd4fff4460975b8793cdbee6da003a11432c7c48ed046671c',
    //   r: '0x8a1a4362b6f84d6f41d180086cd67c7fea14191b51e43c6fbe8f56f3a05cc81f',
    //   s: '0x2babeeff7e6dfc64ebd4fff4460975b8793cdbee6da003a11432c7c48ed04667',
    //   v: 28
    // }
    const result = await market.fee('100')
    console.log(result)
  })
})

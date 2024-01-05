import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils'
import { ethers, upgrades } from 'hardhat'

const options: DeployProxyOptions = {
  initializer: 'initialize',
  kind: 'uups',
}
describe('Add', () => {
  it('should return the sum of two numbers', async () => {
    const Market = await ethers.getContractFactory('MscMarketV1')

    const market = await upgrades.deployProxy(Market, ['0x8808D84e7c7d0221fFa4474a2Bc56d3eA0555e26', '0x8808D84e7c7d0221fFa4474a2Bc56d3eA0555e26', 2], options)
    // {
    //   message: '0x8a1a4362b6f84d6f41d180086cd67c7fea14191b51e43c6fbe8f56f3a05cc81f2babeeff7e6dfc64ebd4fff4460975b8793cdbee6da003a11432c7c48ed046671c',
    //   r: '0x8a1a4362b6f84d6f41d180086cd67c7fea14191b51e43c6fbe8f56f3a05cc81f',
    //   s: '0x2babeeff7e6dfc64ebd4fff4460975b8793cdbee6da003a11432c7c48ed04667',
    //   v: 28
    // }
    const result = await market.purchase(
      '0x9e45b41f72d569bae3c8ec59f44993186b8a90bf34ff9587f0b492e7cd144b0e',
      'ETH',
      '0x0795D90c6d60F7c77041862E9aE5059B4d5e0d7A',
      '700',
      '1400',
      '0x8a1a4362b6f84d6f41d180086cd67c7fea14191b51e43c6fbe8f56f3a05cc81f',
      '0x2babeeff7e6dfc64ebd4fff4460975b8793cdbee6da003a11432c7c48ed04667',
      '28',
    )
    console.log(result)
  })
})

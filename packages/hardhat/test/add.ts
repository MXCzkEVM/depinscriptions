import {
  loadFixture,
  time,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Add', () => {
  it('should return the sum of two numbers', async () => {
    const Add = await ethers.getContractFactory('Add')
    const add = await Add.deploy()

    const result = await add.add(2, 3)
    expect(result).to.equal(5)
  })
})

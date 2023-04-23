import { task } from 'hardhat/config'

import { RentRoom, RentRoom__factory } from '../typechain-types'

task('deploy:Contract').setAction(async function (_, { ethers, run }) {
  const tokenFactory: RentRoom__factory = await ethers.getContractFactory('RentRoom')

  console.log('Start deploying')

  const token: RentRoom = <RentRoom>await tokenFactory.deploy()
  await token.deployed()

  console.log('Contract deployed to address:', token.address)
})

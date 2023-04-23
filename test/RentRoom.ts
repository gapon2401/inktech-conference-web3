import hre, { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import { RentRoom } from '../typechain-types'
import { expect } from 'chai'
import { BigNumber } from 'ethers'

describe('RentRoom', function () {
  let contract: RentRoom
  let signers: {
    owner: SignerWithAddress
    user: SignerWithAddress
  }

  const days = 3
  const price = 0.01

  const payForRent = (signer: SignerWithAddress, days: number, value: BigNumber) => {
    return contract.connect(signer).pay(days, {
      value,
    })
  }

  const getRoomCode = (signer: SignerWithAddress) => {
    return contract.connect(signer).getRoomCode()
  }

  before(async function () {
    const allSigners: SignerWithAddress[] = await hre.ethers.getSigners()

    signers = {
      owner: allSigners[0],
      user: allSigners[1],
    }
  })

  beforeEach(async function () {
    const TheFactory = await hre.ethers.getContractFactory('RentRoom')

    contract = <RentRoom>await TheFactory.deploy()

    await contract.deployed()
  })

  it('Withdraws money from to the owner', async function () {
    const value = hre.ethers.utils.parseEther('1.5')
    await signers.user.sendTransaction({
      to: contract.address,
      value,
    })

    await expect(contract.withdraw()).to.changeEtherBalances([signers.owner, contract], [value, value.mul(-1)])
  })

  it('Cannot withdraw money to anyone', async function () {
    const value = hre.ethers.utils.parseEther('1.5')
    await signers.user.sendTransaction({
      to: contract.address,
      value,
    })

    await expect(contract.connect(signers.user).withdraw()).to.be.reverted
  })

  it('Pays for rent successfully', async function () {
    const value = hre.ethers.utils.parseEther(String(days * price))

    const paymentResponse = await payForRent(signers.user, days, value)

    const blockNumBefore = await ethers.provider.getBlockNumber()
    const blockBefore = await ethers.provider.getBlock(blockNumBefore)
    const blockTimestamp = blockBefore.timestamp

    expect(paymentResponse).to.changeEtherBalances([contract, signers.user], [value, value.mul(-1)])
    expect(await contract.roomOwner()).to.equal(signers.user.address)
    expect(await contract.roomExpires()).to.equal(blockTimestamp + days * 24 * 60 * 60)
  })

  it('Reverts ROOM_OCCUPIED when previous room expiration date is not finished', async function () {
    const value = hre.ethers.utils.parseEther(String(days * price))

    await payForRent(signers.user, days, value)

    const paymentResponse = payForRent(signers.user, days, value)

    await expect(paymentResponse).to.be.revertedWith('ROOM_OCCUPIED')
  })

  it('Reverts INVALID_PRICE when it is not enough price to rent a room', async function () {
    const value = hre.ethers.utils.parseEther('0.01')

    const paymentResponse = payForRent(signers.user, 3, value)

    await expect(paymentResponse).to.be.revertedWith('INVALID_PRICE')
  })

  it('Pays for rent successfully when previous expiration has passed', async function () {
    const value = hre.ethers.utils.parseEther(String(days * price))

    await payForRent(signers.user, days, value)

    const blockNumBefore = await ethers.provider.getBlockNumber()
    const blockBefore = await ethers.provider.getBlock(blockNumBefore)
    const blockTimestamp = blockBefore.timestamp

    await ethers.provider.send('evm_mine', [blockTimestamp + days * 24 * 60 * 60 + 10])

    await payForRent(signers.owner, days, value)

    expect(await contract.roomOwner()).to.equal(signers.owner.address)
  })

  it('Returns back overpaid eth to sender', async function () {
    const value = hre.ethers.utils.parseEther('10')

    const expectedPrice = hre.ethers.utils.parseEther(String(days * price))

    const paymentResponse = payForRent(signers.user, days, value)
    await expect(paymentResponse).to.changeEtherBalances(
      [signers.user, contract],
      [expectedPrice.mul(-1), expectedPrice],
    )
  })

  it('Shows the code only for the payer', async function () {
    const value = hre.ethers.utils.parseEther(String(days * price))

    await payForRent(signers.user, days, value)

    const getRoomCodeResponse = getRoomCode(signers.user)

    expect(getRoomCodeResponse).not.to.be.reverted
  })

  it('Reverts NOT_ROOM_OWNER when not payer is trying to get the code', async function () {
    const value = hre.ethers.utils.parseEther(String(days * price))

    await payForRent(signers.user, days, value)
    const getRoomCodeResponse = getRoomCode(signers.owner)

    expect(getRoomCodeResponse).to.be.revertedWith('NOT_ROOM_OWNER')
  })
})

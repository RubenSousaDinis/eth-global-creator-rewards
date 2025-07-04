import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ContractDeployed } from "../generated/schema"
import { ContractDeployed as ContractDeployedEvent } from "../generated/ERC721Factory/ERC721Factory"
import { handleContractDeployed } from "../src/erc-721-factory"
import { createContractDeployedEvent } from "./erc-721-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let mintData = "ethereum.Tuple Not implemented"
    let clone = Address.fromString("0x0000000000000000000000000000000000000001")
    let postId = "Example string value"
    let from = BigInt.fromI32(234)
    let to = BigInt.fromI32(234)
    let newContractDeployedEvent = createContractDeployedEvent(
      mintData,
      clone,
      postId,
      from,
      to
    )
    handleContractDeployed(newContractDeployedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ContractDeployed created and stored", () => {
    assert.entityCount("ContractDeployed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContractDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "mintData",
      "ethereum.Tuple Not implemented"
    )
    assert.fieldEquals(
      "ContractDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "clone",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ContractDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "postId",
      "Example string value"
    )
    assert.fieldEquals(
      "ContractDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "234"
    )
    assert.fieldEquals(
      "ContractDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "to",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

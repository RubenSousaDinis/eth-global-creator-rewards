import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { ContractDeployed } from "../generated/ERC721Factory/ERC721Factory"

export function createContractDeployedEvent(
  mintData: ethereum.Tuple,
  clone: Address,
  postId: string,
  from: BigInt,
  to: BigInt
): ContractDeployed {
  let contractDeployedEvent = changetype<ContractDeployed>(newMockEvent())

  contractDeployedEvent.parameters = new Array()

  contractDeployedEvent.parameters.push(
    new ethereum.EventParam("mintData", ethereum.Value.fromTuple(mintData))
  )
  contractDeployedEvent.parameters.push(
    new ethereum.EventParam("clone", ethereum.Value.fromAddress(clone))
  )
  contractDeployedEvent.parameters.push(
    new ethereum.EventParam("postId", ethereum.Value.fromString(postId))
  )
  contractDeployedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromUnsignedBigInt(from))
  )
  contractDeployedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromUnsignedBigInt(to))
  )

  return contractDeployedEvent
}

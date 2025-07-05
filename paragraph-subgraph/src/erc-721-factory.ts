import { ContractDeployed as ContractDeployedEvent } from "../generated/ERC721Factory/ERC721Factory"
import { ContractDeployed } from "../generated/schema"

export function handleContractDeployed(event: ContractDeployedEvent): void {
  let entity = new ContractDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.name = event.params.mintData.name_
  entity.symbol = event.params.mintData.symbol_
  entity.owner = event.params.mintData.ownerAddr
  entity.minter = event.params.mintData.minterAddr
  entity.creatorReferrer =event.params.mintData.creatorReferrerAddr
  entity.maxSupply = event.params.mintData.maxSupply
  entity.priceWei = event.params.mintData.priceWei
  entity.clone = event.params.clone
  entity.postId = event.params.postId
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

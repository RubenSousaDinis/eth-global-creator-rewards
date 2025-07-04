import { ContractDeployed as ContractDeployedEvent } from "../generated/ERC721Factory/ERC721Factory"
import { ContractDeployed } from "../generated/schema"

export function handleContractDeployed(event: ContractDeployedEvent): void {
  let entity = new ContractDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.mintData_name_ = event.params.mintData.name_
  entity.mintData_symbol_ = event.params.mintData.symbol_
  entity.mintData_ownerAddr = event.params.mintData.ownerAddr
  entity.mintData_minterAddr = event.params.mintData.minterAddr
  entity.mintData_creatorReferrerAddr =
    event.params.mintData.creatorReferrerAddr
  entity.mintData_maxSupply = event.params.mintData.maxSupply
  entity.mintData_priceWei = event.params.mintData.priceWei
  entity.clone = event.params.clone
  entity.postId = event.params.postId
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

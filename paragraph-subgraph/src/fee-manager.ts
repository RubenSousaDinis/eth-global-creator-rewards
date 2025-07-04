import { FeeDistributed as FeeDistributedEvent } from "../generated/FeeManager/FeeManager"
import { FeeDistributed } from "../generated/schema"

export function handleFeeDistributed(event: FeeDistributedEvent): void {
  let entity = new FeeDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.minter = event.params.minter
  entity.caller = event.params.caller
  entity.recipient = event.params.recipient
  entity.amount = event.params.amount
  entity.feeType = event.params.feeType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

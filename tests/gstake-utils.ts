import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ClaimFromPending,
  ClaimUndelegation,
  Delegate,
  Deposit,
  Deposit_,
  EIP712DomainChanged,
  IndexerDelegate,
  IndexerUnDelegate,
  Initialized,
  NewDelegator,
  OwnershipTransferred,
  RequestUndelegate,
  RewardUpdated,
  Transfer,
  Withdraw
} from "../generated/Gstake/Gstake"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createClaimFromPendingEvent(amount: BigInt): ClaimFromPending {
  let claimFromPendingEvent = changetype<ClaimFromPending>(newMockEvent())

  claimFromPendingEvent.parameters = new Array()

  claimFromPendingEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimFromPendingEvent
}

export function createClaimUndelegationEvent(
  undelegationId: BigInt
): ClaimUndelegation {
  let claimUndelegationEvent = changetype<ClaimUndelegation>(newMockEvent())

  claimUndelegationEvent.parameters = new Array()

  claimUndelegationEvent.parameters.push(
    new ethereum.EventParam(
      "undelegationId",
      ethereum.Value.fromUnsignedBigInt(undelegationId)
    )
  )

  return claimUndelegationEvent
}

export function createDelegateEvent(
  amount: BigInt,
  percentage: BigInt
): Delegate {
  let delegateEvent = changetype<Delegate>(newMockEvent())

  delegateEvent.parameters = new Array()

  delegateEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  delegateEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return delegateEvent
}

export function createDepositEvent(
  sender: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositEvent
}

export function createDeposit_Event(
  sender: Address,
  owner: Address,
  assets: BigInt,
  tax: BigInt,
  shares: BigInt
): Deposit_ {
  let depositEvent = changetype<Deposit_>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("tax", ethereum.Value.fromUnsignedBigInt(tax))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createIndexerDelegateEvent(
  indexer: Address,
  amount: BigInt,
  share: BigInt
): IndexerDelegate {
  let indexerDelegateEvent = changetype<IndexerDelegate>(newMockEvent())

  indexerDelegateEvent.parameters = new Array()

  indexerDelegateEvent.parameters.push(
    new ethereum.EventParam("indexer", ethereum.Value.fromAddress(indexer))
  )
  indexerDelegateEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  indexerDelegateEvent.parameters.push(
    new ethereum.EventParam("share", ethereum.Value.fromUnsignedBigInt(share))
  )

  return indexerDelegateEvent
}

export function createIndexerUnDelegateEvent(
  indexer: Address,
  amount: BigInt,
  share: BigInt
): IndexerUnDelegate {
  let indexerUnDelegateEvent = changetype<IndexerUnDelegate>(newMockEvent())

  indexerUnDelegateEvent.parameters = new Array()

  indexerUnDelegateEvent.parameters.push(
    new ethereum.EventParam("indexer", ethereum.Value.fromAddress(indexer))
  )
  indexerUnDelegateEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  indexerUnDelegateEvent.parameters.push(
    new ethereum.EventParam("share", ethereum.Value.fromUnsignedBigInt(share))
  )

  return indexerUnDelegateEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createNewDelegatorEvent(
  index: BigInt,
  delegator: Address
): NewDelegator {
  let newDelegatorEvent = changetype<NewDelegator>(newMockEvent())

  newDelegatorEvent.parameters = new Array()

  newDelegatorEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  newDelegatorEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )

  return newDelegatorEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRequestUndelegateEvent(
  amount: BigInt
): RequestUndelegate {
  let requestUndelegateEvent = changetype<RequestUndelegate>(newMockEvent())

  requestUndelegateEvent.parameters = new Array()

  requestUndelegateEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return requestUndelegateEvent
}

export function createRewardUpdatedEvent(
  indexer: Address,
  reward: BigInt
): RewardUpdated {
  let rewardUpdatedEvent = changetype<RewardUpdated>(newMockEvent())

  rewardUpdatedEvent.parameters = new Array()

  rewardUpdatedEvent.parameters.push(
    new ethereum.EventParam("indexer", ethereum.Value.fromAddress(indexer))
  )
  rewardUpdatedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )

  return rewardUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createWithdrawEvent(
  sender: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}

import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  ClaimGRT,
  Initialized,
  LockGRT,
  Matched,
  Transfer,
  Undelegate,
  WithdrawalCanceled,
  WithdrawalClaimed,
  WithdrawalRequested
} from "../generated/WithdrawQueue/WithdrawQueue"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createClaimGRTEvent(
  recipient: Address,
  amount: BigInt
): ClaimGRT {
  let claimGrtEvent = changetype<ClaimGRT>(newMockEvent())

  claimGrtEvent.parameters = new Array()

  claimGrtEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  claimGrtEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimGrtEvent
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

export function createLockGRTEvent(amount: BigInt): LockGRT {
  let lockGrtEvent = changetype<LockGRT>(newMockEvent())

  lockGrtEvent.parameters = new Array()

  lockGrtEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return lockGrtEvent
}

export function createMatchedEvent(tokenId: BigInt): Matched {
  let matchedEvent = changetype<Matched>(newMockEvent())

  matchedEvent.parameters = new Array()

  matchedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return matchedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
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
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUndelegateEvent(
  undelegateId: BigInt,
  totalGRT: BigInt,
  lockedGRT: BigInt,
  timestamp: BigInt
): Undelegate {
  let undelegateEvent = changetype<Undelegate>(newMockEvent())

  undelegateEvent.parameters = new Array()

  undelegateEvent.parameters.push(
    new ethereum.EventParam(
      "undelegateId",
      ethereum.Value.fromUnsignedBigInt(undelegateId)
    )
  )
  undelegateEvent.parameters.push(
    new ethereum.EventParam(
      "totalGRT",
      ethereum.Value.fromUnsignedBigInt(totalGRT)
    )
  )
  undelegateEvent.parameters.push(
    new ethereum.EventParam(
      "lockedGRT",
      ethereum.Value.fromUnsignedBigInt(lockedGRT)
    )
  )
  undelegateEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return undelegateEvent
}

export function createWithdrawalCanceledEvent(
  tokenId: BigInt
): WithdrawalCanceled {
  let withdrawalCanceledEvent = changetype<WithdrawalCanceled>(newMockEvent())

  withdrawalCanceledEvent.parameters = new Array()

  withdrawalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return withdrawalCanceledEvent
}

export function createWithdrawalClaimedEvent(
  tokenId: BigInt,
  owner: Address,
  timestamp: BigInt
): WithdrawalClaimed {
  let withdrawalClaimedEvent = changetype<WithdrawalClaimed>(newMockEvent())

  withdrawalClaimedEvent.parameters = new Array()

  withdrawalClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  withdrawalClaimedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawalClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return withdrawalClaimedEvent
}

export function createWithdrawalRequestedEvent(
  tokenId: BigInt,
  owner: Address,
  wstGRT: BigInt,
  grt: BigInt,
  timestamp: BigInt
): WithdrawalRequested {
  let withdrawalRequestedEvent = changetype<WithdrawalRequested>(newMockEvent())

  withdrawalRequestedEvent.parameters = new Array()

  withdrawalRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  withdrawalRequestedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawalRequestedEvent.parameters.push(
    new ethereum.EventParam("wstGRT", ethereum.Value.fromUnsignedBigInt(wstGRT))
  )
  withdrawalRequestedEvent.parameters.push(
    new ethereum.EventParam("grt", ethereum.Value.fromUnsignedBigInt(grt))
  )
  withdrawalRequestedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return withdrawalRequestedEvent
}

import { Address, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { Gstake as GstakeContract } from "../generated/Gstake/Gstake";
import {
  RebateCollected as RebateCollectedEvent,
  AllocationClosed as AllocationClosedEvent,
  StakeDelegatedLocked as StakeDelegatedLockedEvent,
  TheGraphStaking as TheGraphStakingContract,
} from "../generated/TheGraphStaking/TheGraphStaking";

import { IndexerInfo } from "../generated/schema";
import { _1e18, createRewardHistory } from "./common";

//token status :1.matching 2.undelegate 3.claimable 4.finished
export function handleRebateCollected(event: RebateCollectedEvent): void {
  updateIndexer(event.address, event.params.indexer);
}

export function handleAllocationClosed(event: AllocationClosedEvent): void {
  updateIndexer(event.address, event.params.indexer);
  createRewardHistory(
    Address.fromBytes(dataSource.context().getBytes("gstakeAddr")),
    event.block.timestamp
  );
}

// export function handleStakeDelegatedLocked(
//   event: StakeDelegatedLockedEvent
// ): void {

// }

function updateIndexer(contractAddr: Address, indexer: Bytes): void {
  let indexerInfo = IndexerInfo.load(indexer);
  if (indexerInfo == null) {
    return;
  }
  const contract = TheGraphStakingContract.bind(contractAddr);
  const poolInfo = contract.delegationPools(Address.fromBytes(indexer));
  indexerInfo.poolShares = poolInfo.shares;
  indexerInfo.poolGrtAmt = poolInfo.tokens.toBigDecimal().div(_1e18);
  indexerInfo.grtAmt = poolInfo.tokens
    .toBigDecimal()
    .times(indexerInfo.shares.toBigDecimal())
    .div(poolInfo.shares.toBigDecimal())
    .div(_1e18);
  indexerInfo.shareRate = poolInfo.tokens
    .toBigDecimal()
    .div(poolInfo.shares.toBigDecimal());
  indexerInfo.needUpdate = true;
  indexerInfo.save();
}

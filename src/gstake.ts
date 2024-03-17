import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  dataSource,
  log,
} from "@graphprotocol/graph-ts";
import {
  ClaimUndelegation as ClaimUndelegationEvent,
  Delegate as DelegateEvent,
  Deposit as DepositEvent,
  IndexerDelegate as IndexerDelegateEvent,
  IndexerUnDelegate as IndexerUnDelegateEvent,
  NewDelegator as NewDelegatorEvent,
  RequestUndelegate as RequestUndelegateEvent,
  RewardUpdated as RewardUpdatedEvent,
  Transfer as TransferEvent,
  Gstake as GstakeContract,
  WRStatusChanged as WRStatusChangedEvent,
  WithdrawalClaimed as WithdrawalClaimedEvent,
  WithdrawalRequested as WithdrawalRequestedEvent,
} from "../generated/Gstake/Gstake";

import { EpochManager as EpochManagerContract } from "../generated/Gstake/EpochManager";

import { TheGraphStaking as TheGraphStakingContract } from "../generated/TheGraphStaking/TheGraphStaking";
import {
  GstakeInfo,
  Delegator,
  UserInfo,
  UndelegateInfo,
  IndexerInfo,
  DelegationInfo,
  TokenInfo,
  UserWstGRTHistory,
} from "../generated/schema";

import { _1e18, createRewardHistory } from "./common";

const gstakeInfoId = Bytes.fromHexString("0x01");

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from;
  let to = event.params.to;
  let amount = event.params.value;
  if (amount.gt(BigInt.zero())) {
    updateGstakeInfo(event.address, event.block.timestamp, event.block.number);
    handleUserInfo(event, from, amount, true);
    handleUserInfo(event, to, amount, false);

    // update treasuryRewardGrt
    let contract = GstakeContract.bind(event.address);
    let _info = contract.try_getGstakeInfo();
    if (!_info.reverted) {
      if (_info.value.treasury.equals(to) && from.equals(Address.zero())) {
        let gstakeInfo = GstakeInfo.load(gstakeInfoId);
        if (gstakeInfo != null) {
          gstakeInfo.treasuryRewardGrt = gstakeInfo.treasuryRewardGrt.plus(
            amount.toBigDecimal().div(_1e18)
          );
          gstakeInfo.save();
        }
      }
    }
  }
}

function handleUserInfo(
  event: TransferEvent,
  address: Bytes,
  amount: BigInt,
  isFrom: bool
): void {
  if (address.equals(Address.zero())) {
    return;
  }
  let info = UserInfo.load(address);
  if (info == null) {
    info = new UserInfo(address);
    info.wstGRT = BigDecimal.zero();
    // update total user
    let gstakeInfo = GstakeInfo.load(gstakeInfoId);
    if (gstakeInfo != null) {
      gstakeInfo.totalUser = gstakeInfo.totalUser.plus(BigInt.fromI32(1));
      gstakeInfo.save();
    }
  }
  let amountDecimal = amount.toBigDecimal().div(_1e18);
  if (isFrom) {
    info.wstGRT = info.wstGRT.minus(amountDecimal);
  } else {
    info.wstGRT = info.wstGRT.plus(amountDecimal);
  }
  info.save();

  const snapshot = new UserWstGRTHistory(
    address
      .concat(event.transaction.hash)
      .concatI32(event.transactionLogIndex.toI32())
  );
  snapshot.user = address;
  if (Address.zero().equals(event.params.from)) {
    snapshot.type = BigInt.fromU32(3);
  } else if (Address.zero().equals(event.params.to)) {
    snapshot.type = BigInt.fromU32(4);
  } else {
    if (isFrom) {
      snapshot.type = BigInt.fromU32(2);
    } else {
      snapshot.type = BigInt.fromU32(1);
    }
  }

  snapshot.wstGRT = amountDecimal;
  snapshot.balance = info.wstGRT;
  snapshot.wstGRTUsdPrice = BigDecimal.zero();
  snapshot.blockNumber = event.block.number;
  snapshot.blockTimestamp = event.block.timestamp;
  snapshot.transactionHash = event.transaction.hash;
  snapshot.save();
}

function updateGstakeInfo(
  gstakeAddr: Address,
  timestamp_: BigInt,
  blockNum: BigInt
): void {
  let info = GstakeInfo.load(gstakeInfoId);
  if (info == null) {
    info = new GstakeInfo(gstakeInfoId);
    info.firstTime = timestamp_;
    info.firstBlockNum = blockNum;
    info.undelegateFreezeTime = BigInt.zero();
    info.uniswapv3Price = BigDecimal.zero();
    info.withdrawLeft = BigDecimal.zero();
    info.depositLeft = BigDecimal.zero();
    info.withdrawMinLimit = BigDecimal.fromString("0.01");
    info.totalUser = BigInt.zero();
    info.treasuryRewardGrt = BigDecimal.zero();
    info.curDelegator = Bytes.empty();
  }
  let contract = GstakeContract.bind(gstakeAddr);
  let _info = contract.try_getGstakeInfo();
  if (!_info.reverted) {
    info.pendingGRT = _info.value.pendingGRT.toBigDecimal().div(_1e18);
    info.feeRate = _info.value.feeRate
      .toBigDecimal()
      .div(BigDecimal.fromString("1000000"));
  }
  info.totalGRT = contract
    .totalAssets()
    .toBigDecimal()
    .div(_1e18);
  if (info.totalGRT.gt(BigDecimal.zero())) {
    info.exchangeRate = contract
      .totalSupply()
      .toBigDecimal()
      .div(_1e18)
      .div(info.totalGRT);
  }

  info.apr = BigDecimal.fromString("0.15");
  info.taxRate = BigDecimal.fromString("0.005");
  if (!_info.reverted) {
    info.withdrawDebt = _info.value.withdrawDebt.toBigDecimal().div(_1e18);
    const theGraphContract = TheGraphStakingContract.bind(
      _info.value.theGraphStaking
    );
    const _period = theGraphContract.delegationUnbondingPeriod();
    info.undelegateFreezeEpoch = _period;
    const epochManagerContract = EpochManagerContract.bind(
      Address.fromBytes(dataSource.context().getBytes("epochManagerAddr"))
    );
    const _epoch = epochManagerContract.epochLength();
    info.undelegateFreezeTime = _epoch.times(_period).times(BigInt.fromI32(12));
    info.matchTime = _epoch.times(BigInt.fromI32(6));

    //update withdraw left

    const nextIndex = _info.value.nextUndelegatorIndex;
    const delegators = contract.getDelegators();
    if (delegators.length > 0) {
      const nextDelegator = delegators[nextIndex.toI32()];
      info.curDelegator = nextDelegator;
      const delegatorInfo = contract.getDelegatorInfo(nextDelegator);
      const totalGRT = delegatorInfo.shares
        .toBigDecimal()
        .times(delegatorInfo.lastGRTPerShare.toBigDecimal())
        .div(_1e18)
        .div(_1e18);
      info.withdrawLeft = totalGRT
        .plus(info.pendingGRT)
        .minus(info.withdrawDebt)
        .minus(BigDecimal.fromString("2"))
        .times(info.exchangeRate)
        .truncate(18);
      const indexerInfo = theGraphContract.stakes(delegatorInfo.indexer);
      const delegationRatio = theGraphContract.delegationRatio();
      const totalDelegateCap = indexerInfo.tokensStaked
        .minus(indexerInfo.tokensLocked)
        .times(delegationRatio);
      const poolInfo = theGraphContract.delegationPools(delegatorInfo.indexer);
      info.depositLeft = totalDelegateCap
        .minus(poolInfo.tokens)
        .toBigDecimal()
        .div(_1e18);
    }
  }

  info.withdrawMinLimit = BigDecimal.fromString("0.01");
  info.save();
}

export function handleClaimUndelegation(event: ClaimUndelegationEvent): void {
  let info = UndelegateInfo.load(bigInt2Bytes(event.params.undelegationId));
  if (info != null) {
    const tokens = info.tokens.load();
    info.status = BigInt.fromU32(3);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const _tokenInfo = TokenInfo.load(token.id);
      if (_tokenInfo != null) {
        _tokenInfo.status = BigInt.fromU32(3);
        _tokenInfo.save();
      }
    }
    info.save();
  }
}

// export function handleSubmitUndelegation(event: ClaimUndelegationEvent): void {
//   updateGstakeInfo(event.address, event.block.timestamp, event.block.number);
//   let info = UndelegateInfo.load(bigInt2Bytes(event.params.undelegationId));
//   if (info != null) {
//     info.status = BigInt.fromU32(2);
//     let _info = GstakeInfo.load(gstakeInfoId);
//     if (_info != null && _info.undelegateFreezeTime.gt(BigInt.zero())) {
//       const epochManagerContract = EpochManagerContract.bind(
//         Address.fromBytes(dataSource.context().getBytes("epochManagerAddr"))
//       );
//       info.tokensLockedUntilEpoch = epochManagerContract
//         .currentEpoch()
//         .plus(_info.undelegateFreezeEpoch);
//       info.tokensLockedUntil = event.block.timestamp.plus(
//         _info.undelegateFreezeTime
//       );
//     }
//     info.save();
//   }
// }

export function handleDelegate(event: DelegateEvent): void {
  updateGstakeInfo(event.address, event.block.timestamp, event.block.number);
}

export function handleDeposit(event: DepositEvent): void {}

export function handleIndexerDelegate(event: IndexerDelegateEvent): void {
  const indexer = event.params.indexer;
  const delegator = event.params.delegator;
  let indexerInfo = IndexerInfo.load(indexer);
  if (indexerInfo == null) {
    indexerInfo = new IndexerInfo(indexer);
    indexerInfo.shares = BigInt.zero();

    indexerInfo.poolShares = BigInt.zero();
    indexerInfo.poolGrtAmt = BigDecimal.zero();
    indexerInfo.grtAmt = BigDecimal.zero();
    indexerInfo.cacheShareRate = BigDecimal.zero();
    indexerInfo.shareRate = BigDecimal.zero();
    indexerInfo.needUpdate = false;
  }
  let contract = GstakeContract.bind(event.address);
  let _info = contract.try_getGstakeInfo();
  if (!_info.reverted) {
    const theGraphContract = TheGraphStakingContract.bind(
      _info.value.theGraphStaking
    );
    const poolInfo = theGraphContract.delegationPools(indexer);
    indexerInfo.poolShares = poolInfo.shares;
    indexerInfo.shares = indexerInfo.shares.plus(event.params.share);
    indexerInfo.poolGrtAmt = poolInfo.tokens.toBigDecimal().div(_1e18);
    indexerInfo.grtAmt = poolInfo.tokens
      .toBigDecimal()
      .times(indexerInfo.shares.toBigDecimal())
      .div(poolInfo.shares.toBigDecimal())
      .div(_1e18);
    indexerInfo.shareRate = poolInfo.tokens
      .toBigDecimal()
      .div(poolInfo.shares.toBigDecimal());
    indexerInfo.needUpdate = false;
    indexerInfo.save();
  }

  const id = indexer.concat(delegator);
  let delegationInfo = DelegationInfo.load(id);
  if (delegationInfo == null) {
    delegationInfo = new DelegationInfo(id);
    delegationInfo.indexerInfo = indexer;
    delegationInfo.delegator = delegator;
    delegationInfo.shares = event.params.share;
  } else {
    delegationInfo.shares = delegationInfo.shares.plus(event.params.share);
  }
  delegationInfo.save();
}

export function handleIndexerUnDelegate(event: IndexerUnDelegateEvent): void {
  updateGstakeInfo(event.address, event.block.timestamp, event.block.number);
  const indexer = event.params.indexer;
  const delegator = event.params.delegator;
  const id = indexer.concat(delegator);
  let delegationInfo = DelegationInfo.load(id);
  if (delegationInfo != null) {
    delegationInfo.shares = delegationInfo.shares.minus(event.params.share);
    delegationInfo.save();
  }

  let indexerInfo = IndexerInfo.load(indexer);
  if (indexerInfo != null) {
    indexerInfo.shares = indexerInfo.shares.minus(event.params.share);
    indexerInfo.save();
  }

  let info = UndelegateInfo.load(bigInt2Bytes(event.params.undelegationId));
  if (info != null) {
    info.status = BigInt.fromU32(2);
    let _info = GstakeInfo.load(gstakeInfoId);
    if (_info != null && _info.undelegateFreezeTime.gt(BigInt.zero())) {
      const epochManagerContract = EpochManagerContract.bind(
        Address.fromBytes(dataSource.context().getBytes("epochManagerAddr"))
      );
      info.tokensLockedUntilEpoch = epochManagerContract
        .currentEpoch()
        .plus(_info.undelegateFreezeEpoch);
      info.tokensLockedUntil = event.block.timestamp.plus(
        _info.undelegateFreezeTime
      );
    }
    info.save();
  }
}

export function handleNewDelegator(event: NewDelegatorEvent): void {
  let delegator = new Delegator(event.params.delegator);
  delegator.index = event.params.index;
  delegator.save();
}

export function handleRewardUpdated(event: RewardUpdatedEvent): void {
  let contract = GstakeContract.bind(event.address);
  let _info = contract.try_getGstakeInfo();
  if (!_info.reverted) {
    updateIndexer(_info.value.theGraphStaking, event.params.indexer, false);
  }
  createRewardHistory(dataSource.address(), event.block.timestamp);
  updateGstakeInfo(event.address, event.block.timestamp, event.block.number);
}

export function handleWithdrawalRequested(
  event: WithdrawalRequestedEvent
): void {
  let tokenId = event.params.tokenId;
  let token = new TokenInfo(bigInt2Bytes(tokenId));
  token.tokenId = tokenId;
  token.owner = event.params.owner;
  token.wstGRT = event.params.wstGRT.toBigDecimal().div(_1e18);
  token.amountOfGRT = event.params.grt.toBigDecimal().div(_1e18);
  token.status = BigInt.fromU32(1);
  token.blockNumber = event.block.number;
  token.blockTimestamp = event.block.timestamp;
  token.transactionHash = event.transaction.hash;
  token.save();
}

export function handleWithdrawalClaimed(event: WithdrawalClaimedEvent): void {
  let token = TokenInfo.load(bigInt2Bytes(event.params.tokenId));
  if (token != null) {
    token.status = BigInt.fromU32(4);
    token.save();
  }
}

export function handleWRStatusChanged(event: WRStatusChangedEvent): void {
  let token = TokenInfo.load(bigInt2Bytes(event.params.id));
  if (token != null) {
    token.status = BigInt.fromU32(3);
    token.save();
  }
}

export function handleRequestUndelegate(event: RequestUndelegateEvent): void {
  let info = new UndelegateInfo(bigInt2Bytes(event.params.undelegateId));
  info.lockedGRT = event.params.lockedGRT.toBigDecimal().div(_1e18);
  info.leftGRT = event.params.totalGRT
    .minus(event.params.lockedGRT)
    .toBigDecimal()
    .div(_1e18);
  info.status = BigInt.fromU32(1);
  info.timestamp = event.block.timestamp;
  const ids = event.params.ids;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let token = new TokenInfo(bigInt2Bytes(id));
    token.status = BigInt.fromU32(2);
    token.undelegateInfo = bigInt2Bytes(event.params.undelegateId);
    token.save();
  }
  info.save();
}

function updateIndexer(
  contractAddr: Address,
  indexer: Bytes,
  needUpdate: boolean
): void {
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
  indexerInfo.needUpdate = needUpdate;
  indexerInfo.cacheShareRate = indexerInfo.shareRate;
  indexerInfo.save();
}

function bigInt2Bytes(num: BigInt): Bytes {
  let hexString = num.toHexString();
  if (hexString.startsWith("0x")) {
    hexString = hexString.substring(2);
  }
  if (hexString.length % 2 != 0) {
    hexString = "0" + hexString;
  }
  return Bytes.fromHexString(hexString);
}

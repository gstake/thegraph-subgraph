import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Gstake as GstakeContract } from "../generated/Gstake/Gstake";

import { WstGrtHistory } from "../generated/schema";

//token status :1.matching 2.undelegate 3.claimable 4.finished

export const _1e18 = BigDecimal.fromString("1000000000000000000");

export const DaySec = BigInt.fromU32(86400);
export function createRewardHistory(
  gstakeAddr: Address,
  timestamp_: BigInt
): void {
  let contract = GstakeContract.bind(gstakeAddr);
  let _info = contract.try_getGstakeInfo();
  const _day = timestamp_.div(DaySec).times(DaySec);
  let history = WstGrtHistory.load(bigInt2Bytes(_day));
  if (history == null) {
    history = new WstGrtHistory(bigInt2Bytes(_day));
    if (!_info.reverted) {
      const totalGRT = _info.value.pendingGRT
        .plus(_info.value.stakedGRT)
        .minus(_info.value.withdrawDebt);
      const wstTotal = contract.totalSupply().toBigDecimal();
      if (wstTotal.gt(BigDecimal.zero())) {
        history.grtRate = totalGRT.toBigDecimal().div(wstTotal);
      } else {
        history.grtRate = BigDecimal.fromString("1");
      }
    }
    history.usdRate = history.grtRate;
    history.timestamp = _day;
    history.save();
  }
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

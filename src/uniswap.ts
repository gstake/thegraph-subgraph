import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Swap as SwapEvent } from "../generated/UniswapV3/UniswapV3";
import { GstakeInfo } from "../generated/schema";

//token status :1.matching 2.undelegate 3.claimable 4.finished

const _1e18 = BigDecimal.fromString("1000000000000000000");
const gstakeInfoId = Bytes.fromHexString("0x01");
const _296 = BigInt.fromU32(2).pow(192); //(2^96)^2
// address(token0) < address(token1)
// price = token1/token0
export function handleSwap(event: SwapEvent): void {
  const info = GstakeInfo.load(gstakeInfoId);
  if (info != null) {
    const _sqrtPriceX96 = event.params.sqrtPriceX96.toBigDecimal();
    const _sqrtPriceX962 = _sqrtPriceX96.times(_sqrtPriceX96);
    info.uniswapv3Price = _296.toBigDecimal().div(_sqrtPriceX962);
    info.save();
  }
}

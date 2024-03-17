import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/WithdrawQueue/WithdrawQueue";
import { TokenInfo } from "../generated/schema";

//token status :1.matching 2.undelegate 3.claimable 4.finished

export function handleTransfer(event: TransferEvent): void {
  let tokenId = event.params.tokenId;
  let token = TokenInfo.load(bigInt2Bytes(tokenId));
  if (token != null) {
    const to = event.params.to;
    if (to.notEqual(Address.zero())) {
      token.owner = event.params.to;
      token.save();
    }
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

import type { Contract } from "ethers";
import type { AccountInfo } from "./stores/accountInfo";

export const getBalanceOf = async (
  contract: Contract,
  accountInfo: AccountInfo
) => {
  if (accountInfo.signer) {
    const address = await accountInfo.signer.getAddress();
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return balance / 10 ** decimals;
  } else {
    return 0;
  }
};

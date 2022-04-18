import { writable } from "svelte/store";
import { providers, Signer } from "ethers";
import { Chain, Token, tokens } from "../tokens";

export class AccountInfo {
  public signer: null | Signer = null;
  public provider: providers.Web3Provider;
  public fromToken: Token;
  public toToken: Token;

  constructor(chain: Chain) {
    if (chain === Chain.ACALA) {
      this.fromToken = tokens.find((token) => token.symbol === "LDOT");
    } else if (chain === Chain.MANDALA || chain === Chain.KARURA) {
      this.fromToken = tokens.find((token) => token.symbol === "LKSM");
    }

    this.toToken = tokens.find((token) => token.symbol === "aUSD");

    this.provider = new providers.Web3Provider((window as any).ethereum);
  }
}

export const accountInfo = writable(new AccountInfo(Chain.MANDALA));

import { writable } from "svelte/store";
import { providers, Signer, Contract, BigNumber } from "ethers";
import { Chain, Token, tokens } from "../tokens";
import DexABI from "../../abis/DEX.json";
import ERC20Abi from "../../abis/ERC20.json";

const DEX_ADDRESS_MANDALA = "0x0000000000000000000000000000000000000804";

export class AccountInfo {
  public signer: null | Signer = null;
  public provider: providers.Web3Provider;
  public fromToken: Token;
  public toToken: Token;
  public fromTokenAmount = 0;
  public toTokenAmount = 0;
  public slippage = 0.5;
  public dexContract: Contract;
  public fromTokenContract: Contract;
  public toTokenContract: Contract;

  constructor(chain: Chain) {
    if (chain === Chain.ACALA) {
      this.fromToken = tokens.find((token) => token.symbol === "LDOT");
    } else if (chain === Chain.MANDALA || chain === Chain.KARURA) {
      this.fromToken = tokens.find((token) => token.symbol === "LKSM");
    }

    this.toToken = tokens.find((token) => token.symbol === "aUSD");

    this.provider = new providers.Web3Provider((window as any).ethereum);

    this.dexContract = new Contract(DEX_ADDRESS_MANDALA, DexABI, this.provider);
    this.fromTokenContract = new Contract(
      this.fromToken.address,
      ERC20Abi,
      this.provider
    );
    this.toTokenContract = new Contract(
      this.toToken.address,
      ERC20Abi,
      this.provider
    );
    // console.log(
    //   this.dex
    //     .getSwapTargetAmount(
    //       [
    //         "0x0000000000000000000100000000000000000000",
    //         "0x0000000000000000000100000000000000000001",
    //       ],
    //       1000000000000
    //     )
    //     .then((value: BigNumber) => {
    //       console.log(value.toNumber() / 10 ** 12);
    //     })
    // );
  }

  public updateContract(from: boolean) {
    if (from) {
      this.fromTokenContract = new Contract(
        this.fromToken.address,
        ERC20Abi,
        this.provider
      );
    } else {
      this.toTokenContract = new Contract(
        this.toToken.address,
        ERC20Abi,
        this.provider
      );
    }
  }

  public makeSwap() {
    if (this.signer) {
    }
  }
}

export const accountInfo = writable(new AccountInfo(Chain.MANDALA));

import { writable } from "svelte/store";
import { providers, Signer, Contract, utils } from "ethers";
import { Chain, Token, tokens } from "../tokens";
import DexABI from "../../abis/DEX.json";
import ERC20Abi from "../../abis/ERC20.json";
import { parseUnits } from "ethers/lib/utils";

(window as any).utils = utils;

const DEX_ADDRESS_MANDALA = "0x0000000000000000000000000000000000000804";

function trimDecimals(stringNumber: string, decimalsPlaces: number): string {
  const [whole, decimals] = stringNumber.split(".");

  return `${whole ? whole : "0"}.${
    decimals ? decimals.slice(0, decimalsPlaces) : "0"
  }`;
}

export class AccountInfo {
  public signer: null | Signer = null;
  public provider: providers.Web3Provider;
  public fromToken: Token;
  public toToken: Token;
  public fromTokenAmount = "";
  public toTokenAmount = "";
  public ratio = null;
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

  public async getParams() {
    const path = [this.fromToken.address, this.toToken.address];

    const supplyAmountDecimals = await this.fromTokenContract.decimals();
    const totalSupply = utils
      .parseUnits(
        trimDecimals(this.fromTokenAmount, supplyAmountDecimals),
        supplyAmountDecimals
      )
      .toNumber();

    const targetAmountDecimals = await this.toTokenContract.decimals();

    const minTarget =
      utils
        .parseUnits(
          trimDecimals(this.toTokenAmount, targetAmountDecimals),
          targetAmountDecimals
        )
        .toNumber() *
      ((100 - this.slippage) / 100);

    return [path, totalSupply, minTarget];
  }

  public async makeSwap(): Promise<providers.TransactionResponse> {
    if (this.signer) {
      const [path, totalSupply, minTarget] = await this.getParams();

      const dexWithSigner = this.dexContract.connect(this.signer);

      const tx = await dexWithSigner.swapWithExactSupply(
        path,
        totalSupply,
        minTarget
      );

      return tx;
    }
  }
}

export const accountInfo = writable(new AccountInfo(Chain.MANDALA));

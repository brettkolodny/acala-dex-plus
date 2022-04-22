import { writable } from "svelte/store";
import { providers, Signer, Contract, utils, BigNumber } from "ethers";
import { Chain, Token, tokens } from "../tokens";
import DexABI from "../../abis/DEX.json";
import ERC20Abi from "../../abis/ERC20.json";
import { FixedPointNumber } from "@acala-network/sdk-core";

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
  public stableToken: Token;
  public fromTokenAmount = "";
  public toTokenAmount = "";
  public ratio = null;
  public slippage = 0.5;
  public dexContract: Contract;
  public fromTokenContract: Contract;
  public toTokenContract: Contract;

  constructor(chain: Chain) {
    if (chain === Chain.ACALA || chain === Chain.MANDALA) {
      this.fromToken = tokens.find((token) => token.symbol === "ACA");
      const stableToken = tokens.find(
        (token) => token.symbol === "aUSD" && token.chains.includes(Chain.ACALA)
      );
      this.toToken = stableToken;
      this.stableToken = stableToken;
    } else if (chain === Chain.KARURA) {
      this.fromToken = tokens.find((token) => token.symbol === "KAR");
      const stableToken = tokens.find(
        (token) =>
          token.symbol === "aUSD" && token.chains.includes(Chain.KARURA)
      );
      this.toToken = stableToken;
      this.stableToken = stableToken;
    }

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
    let path = [this.fromToken.address, this.toToken.address];

    const supplyAmountDecimals = await this.fromTokenContract.decimals();
    const totalSupply = utils.parseUnits(
      trimDecimals(this.fromTokenAmount, supplyAmountDecimals),
      supplyAmountDecimals
    );

    const targetAmountDecimals = await this.toTokenContract.decimals();

    let target: BigNumber;

    try {
      target = await this.dexContract.getSwapTargetAmount(path, totalSupply);
    } catch {
      path = [path[0], this.stableToken.address, path[1]];
      target = await this.dexContract.getSwapTargetAmount(path, totalSupply);
    }

    const minTarget = new FixedPointNumber(
      target.toString(),
      targetAmountDecimals
    )
      .mul(new FixedPointNumber((100 - this.slippage) / 100))
      .toString()
      .split(".")[0];

    return [path, totalSupply, minTarget];
  }

  public async makeSwap(): Promise<providers.TransactionResponse> {
    if (this.signer) {
      let [path, totalSupply, minTarget] = await this.getParams();

      const dexWithSigner = this.dexContract.connect(this.signer);

      return await dexWithSigner.swapWithExactSupply(
        path,
        totalSupply,
        minTarget
      );
    }
  }
}

export const accountInfo = writable(new AccountInfo(Chain.MANDALA));

import { writable, derived, readable } from "svelte/store";
import { providers, Signer, Contract, utils, BigNumber } from "ethers";
import DexABI from "../../abis/DEX.json";
import ERC20Abi from "../../abis/ERC20.json";
import { tokens, Chain } from "../tokens";

const CHAIN: any = Chain.MANDALA;
const DEX_ADDRESS_MANDALA = "0x0000000000000000000000000000000000000804";

export const provider = new providers.Web3Provider((window as any).ethereum);

export const signer = writable<Signer | null>(null);

export const fromTokenAmount = writable("");
export const toTokenAmount = writable("");

const _fromToken =
  CHAIN === Chain.ACALA || CHAIN === Chain.MANDALA
    ? tokens.find((token) => token.symbol === "ACA")
    : tokens.find((token) => token.symbol === "KAR");

export const fromToken = writable(_fromToken);

const _toToken =
  CHAIN === Chain.ACALA || CHAIN === Chain.MANDALA
    ? tokens.find((token) => token.symbol === "aUSD")
    : tokens.find(
        (token) => token.symbol === "KAR" && token.chains.includes(Chain.KARURA)
      );

export const toToken = writable(_toToken);
export const stableToken = writable(_toToken);

export const fromTokenContract = derived(fromToken, ($fromToken) => {
  return new Contract($fromToken.address, ERC20Abi, provider);
});

export const toTokenContract = derived(toToken, ($toToken) => {
  return new Contract($toToken.address, ERC20Abi, provider);
});

export const dexContract = derived(signer, ($signer) => {
  if ($signer) {
    return new Contract(DEX_ADDRESS_MANDALA, DexABI, $signer);
  } else {
    return new Contract(DEX_ADDRESS_MANDALA, DexABI, provider);
  }
});

export const slippage = writable(0.5);

export const ratio = writable(null);

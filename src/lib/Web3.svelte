<script context="module" lang="ts">
  import { BigNumber, Contract, providers, Signer, utils } from "ethers";
  import {
    dexContract,
    fromToken,
    fromTokenAmount,
    fromTokenContract,
    stableToken,
    toToken,
    toTokenContract,
    slippage,
    signer,
  } from "./stores";
  import { get } from "svelte/store";
  import { FixedPointNumber } from "@acala-network/sdk-core";

  const trimDecimals = (
    stringNumber: string,
    decimalsPlaces: number
  ): string => {
    const [whole, decimals] = stringNumber.split(".");

    return `${whole ? whole : "0"}.${
      decimals ? decimals.slice(0, decimalsPlaces) : "0"
    }`;
  };

  const getParams = async () => {
    let path = [get(fromToken).address, get(toToken).address];

    const supplyAmountDecimals = await get(fromTokenContract).decimals();
    const totalSupply = utils.parseUnits(
      trimDecimals(get(fromTokenAmount), supplyAmountDecimals),
      supplyAmountDecimals
    );

    const targetAmountDecimals = await get(toTokenContract).decimals();

    let target: BigNumber;

    try {
      target = await get(dexContract).getSwapTargetAmount(path, totalSupply);
    } catch {
      path = [path[0], get(stableToken).address, path[1]];
      target = await get(dexContract).getSwapTargetAmount(path, totalSupply);
    }

    const minTarget = new FixedPointNumber(
      target.toString(),
      targetAmountDecimals
    )
      .mul(new FixedPointNumber((100 - get(slippage)) / 100))
      .toString()
      .split(".")[0];

    return [path, totalSupply, minTarget];
  };

  export const getBalanceOf = async (
    contract: Contract,
    signer: Signer | null
  ) => {
    if (signer) {
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      return balance / 10 ** decimals;
    } else {
      return 0;
    }
  };

  export const makeSwap = async (): Promise<providers.TransactionResponse> => {
    if (get(signer)) {
      let [path, totalSupply, minTarget] = await getParams();

      const dexWithSigner = get(dexContract).connect(get(signer));

      return await dexWithSigner.swapWithExactSupply(
        path,
        totalSupply,
        minTarget
      );
    }
  };
</script>

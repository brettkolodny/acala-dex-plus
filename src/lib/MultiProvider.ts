import { Provider as BodhiProvider } from "@acala-network/bodhi";
import { WsProvider } from "@polkadot/api";
import { providers } from "ethers";
import { options } from "@acala-network/api";
import { Chain } from "./tokens";

const ENDPOINTS = {
  mandala: ["wss://mandala.polkawallet.io"],
  karura: [
    "wss://karura-rpc-0.aca-api.network",
    "wss://karura-rpc-1.aca-api.network",
    "wss://karura-rpc-2.aca-api.network/ws",
    "wss://karura-rpc-3.aca-api.network/ws",
    "wss://karura.polkawallet.io",
    "wss://karura.api.onfinality.io/public-ws",
    "wss://karura-rpc.dwellir.com",
  ],
  acala: ["wss://acala-rpc-0.aca-api.network"],
};

export default class MultiProvider {
  private _provider: BodhiProvider | providers.Web3Provider;
  public providerType: "eth" | "bodhi";

  public static createEthProvider(): MultiProvider {
    const newProvider = new MultiProvider();
    newProvider._provider = new providers.Web3Provider(
      (window as any).ethereum
    );
    newProvider.providerType = "eth";

    return newProvider;
  }

  public static createBodhiProvider(chain: Chain): MultiProvider {
    const newProvider = new MultiProvider();
    const endpoints =
      chain === Chain.MANDALA
        ? ENDPOINTS.mandala
        : chain === Chain.ACALA
        ? ENDPOINTS.acala
        : ENDPOINTS.karura;
    const wsProvider = new WsProvider(endpoints);
    newProvider._provider = new BodhiProvider(
      options({ provider: wsProvider }) as any
    );

    return newProvider;
  }

  public get provider(): BodhiProvider | providers.Web3Provider {
    return this._provider;
  }
}

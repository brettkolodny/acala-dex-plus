import type { Provider as BodhiProvider } from "@acala-network/bodhi";
import { providers } from "ethers";

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

  public static createBodhiProvider(): MultiProvider {
    const newProvider = new MultiProvider();

    return newProvider;
  }

  public get provider(): BodhiProvider | providers.Web3Provider {
    return this._provider;
  }
}

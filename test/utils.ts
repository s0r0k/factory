import { Account } from "everscale-standalone-client/nodejs";
import { WalletTypes } from "locklift";
import * as nt from "nekoton-wasm";

export type Wallet = {
  keys: nt.Ed25519KeyPair;
  account: Account;
};
export async function createWalletV3(value: number): Promise<Wallet> {
  const keys = nt.ed25519_generateKeyPair();
  const { account } = await locklift.factory.accounts.addNewAccount({
    type: WalletTypes.WalletV3,
    publicKey: keys.publicKey,
    value: locklift.utils.toNano(value),
  });
  locklift.keystore.addKeyPair(keys);
  const w: Wallet = {
    keys,
    account,
  };
  return w;
}

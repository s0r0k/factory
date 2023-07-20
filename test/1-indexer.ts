import { expect } from "chai";
import { Address, Contract } from "locklift";
import { FactorySource } from "../build/factorySource";
import { Wallet, createWalletV3 } from "./utils";

const logger = require("mocha-logger");

describe("Test index creation for vesting contracts", async function () {
  let admin: Wallet;
  let user0: Wallet;
  let user1: Wallet;
  let user2: Wallet;

  let factory: Contract<FactorySource["Factory"]>;

  let indexCode: string;
  const instanceArtifacts = locklift.factory.getContractArtifacts("Instance");
  const indexArtifacts = locklift.factory.getContractArtifacts("Index");

  beforeEach("Setup contracts", async function () {
    admin = await createWalletV3(20);
    user0 = await createWalletV3(20);
    user1 = await createWalletV3(20);
    user2 = await createWalletV3(20);

    const signer = await locklift.keystore.getSigner("0");
    const deployNonce = locklift.utils.getRandomNonce();

    const { contract: _factory } = await locklift.factory.deployContract({
      contract: "Factory",
      publicKey: signer?.publicKey as string,
      initParams: {
        instanceCode: instanceArtifacts.code,
        deploy_nonce: deployNonce,
      },
      constructorParams: {
        indexCode: indexArtifacts.code,
        indexDeployValue: locklift.utils.toNano(0.2),
        indexDestroyValue: locklift.utils.toNano(0.2),
      },
      value: locklift.utils.toNano(5),
    });
    factory = _factory;
    logger.log(`Factory address: ${factory.address}`);

    indexCode = (await factory.methods.getIndexCode({ answerId: 0 }).call()).value0;
  });
  it("should deploy 2 indexes for user0 as recipient and 3 indexes for user1 as creator", async function () {
    await locklift.tracing.trace(
      factory.methods
        .deployInstance({
          user: user0.account.address,
        })
        .send({ from: user1.account.address, amount: locklift.utils.toNano(2.5) }),
    );
    await locklift.tracing.trace(
      factory.methods
        .deployInstance({
          user: user0.account.address,
        })
        .send({ from: user1.account.address, amount: locklift.utils.toNano(2.5) }),
    );
    await locklift.tracing.trace(
      factory.methods
        .deployInstance({
          user: user2.account.address,
        })
        .send({ from: user1.account.address, amount: locklift.utils.toNano(2.5) }),
    );

    const userIndexCodeHash = await getIndexSaltedCodeHash(
      factory.address,
      indexCode,
      "recipient",
      user0.account.address,
    );
    const creatorIndexCodeHash = await getIndexSaltedCodeHash(
      factory.address,
      indexCode,
      "creator",
      user1.account.address,
    );

    const { accounts: userAccs } = await locklift.provider.getAccountsByCodeHash({ codeHash: userIndexCodeHash });
    const { accounts: creatorAccs } = await locklift.provider.getAccountsByCodeHash({ codeHash: creatorIndexCodeHash });

    expect(userAccs.length).to.be.equal(2);
    expect(creatorAccs.length).to.be.equal(3);
  });
});

export async function getIndexSaltedCodeHash(
  indexFactory: Address,
  indexCode: string,
  indexName: "recipient" | "creator",
  acc: Address,
): Promise<string> {
  const accPacked = await locklift.provider.packIntoCell({
    abiVersion: "2.1",
    structure: [{ name: "value", type: "address" }] as const,
    data: {
      value: acc,
    },
  });
  const { hash: saltedCodeHash } = await locklift.provider.setCodeSalt({
    code: indexCode,
    salt: {
      abiVersion: "2.1",
      structure: [
        { name: "indexFactory", type: "address" },
        { name: "saltKey", type: "string" },
        { name: "saltValue", type: "cell" },
      ] as const,
      data: {
        indexFactory: indexFactory,
        saltKey: indexName,
        saltValue: accPacked.boc,
      },
    },
  });

  return "0x" + saltedCodeHash;
}


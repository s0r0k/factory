# VEP-1111 example

This repository provides an example of how to implement the VEP-1111 standard. All associated contract files can be found in the ./contracts directory.

## Contracts

Contracts within `./contracts/indexer` serve as the reference implementation for this standard and are described in detail in VEP-1111.

For this example, we utilize a straightforward [Factory](https://en.wikipedia.org/wiki/Factory_method_pattern) model that generates instances, each storing the creator, recipient, and nonce.

Let's delve into the `Factory` contract:

The factory extends `IndexFactory`, and hence, the following arguments must be supplied to the constructor:

- indexCode (`TvmCell`)
- indexDeployValue (`uint128`)
- indexDestroyValue (`uint128`)

Once the contract is deployed, an instance of the `Instance` contract can be created using the method:

```sol
function deployInstance(address user) external
```

Inside this method, we aim to establish indexes for each `Instance` to enable look-up by recipient or creator. Consequently, we need to implement a method for `Index` deployment.

```sol
function deployInstanceIndex(address instance, string saltName, address saltValue) internal view;
```

- instance (`address`) - The `Instance` contract address, which will be accessible via the Index
- saltName (`string`) - The name of the index either "recipient" or "creator"
- saltValue (`address`) - The address of the "recipient" or "creator"

This method invokes the `function deployIndex(address indexedContract, string saltKey, TvmCell saltValue)` from the parent contract, where the actual `Index` deployment takes place.

Our `deployInstanceIndex` method is essentially a wrapper that allows us to pack `saltValue` to the TvmCell type. 

Once the `Index` contract is deployed, it can be located by its code hash, for instance, using GraphQL:

```
query {
  accounts( 
    filter: {
      code_hash: {
        eq: "207dc560c5956de1a2c1479356f8f3ee70a59767db2bf4788b1d61ad42cdad82"
      }
    }
  ){
    id
  }
}
```

To calculate code hash for our example, we can use a function:

```ts
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

```

You can find a full example with contracts deployment and look-up of the contracts in the file `./test/1-indexer.ts`.

In this example, we've created an Index using just a single parameter. However, it's entirely feasible to employ any number of parameters, as dictated by our specific requirements. For example, if we have different types of Instance contracts, we could construct an index that includes not only the recipient or creator addresses but also the contract type. To accomplish this, you need to package it as shown in the following example:

```ts
export async function getIndexSaltedCodeHash(
  indexFactory: Address,
  indexCode: string,
  indexName: "recipient" | "creator",
  instanceType: "foo" | "bar",
  acc: Address,
): Promise<string> {
  const saltValuePacked = await locklift.provider.packIntoCell({
    abiVersion: "2.1",
    structure: [
      { name: "instanceType", type: "string" }, // we can add any number of additional params to create index
      { name: "value", type: "address" },
    ] as const,
    data: {
      instanceType: instanceType,
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
        saltValue: saltValuePacked.boc,
      },
    },
  });

  return "0x" + saltedCodeHash;
}
```

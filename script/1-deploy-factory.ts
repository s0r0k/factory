async function main() {
  console.log(`Deploying Indexer and Vesting Factory`);
  const signer = (await locklift.keystore.getSigner("0"))!;

  const instanceContract = locklift.factory.getContractArtifacts("Instance");
  const indexContract = locklift.factory.getContractArtifacts("Index");

  const deployNonce = locklift.utils.getRandomNonce();

  console.log("Deploying Factory");
  const { contract: factory } = await locklift.factory.deployContract({
    contract: "Factory",
    publicKey: signer?.publicKey as string,
    initParams: {
      deploy_nonce: deployNonce,
      instanceCode: instanceContract.code,
    },
    constructorParams: {
      indexCode: indexContract.code,
      indexDeployValue: locklift.utils.toNano(0.2),
      indexDestroyValue: locklift.utils.toNano(0.2),
    },
    value: locklift.utils.toNano(5),
  });

  console.log(`factory address: ${factory.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

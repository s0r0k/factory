const factoryAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"indexCode","type":"cell"},{"name":"indexDeployValue","type":"uint128"},{"name":"indexDestroyValue","type":"uint128"}],"outputs":[]},{"name":"deployInstance","inputs":[{"name":"user","type":"address"}],"outputs":[]},{"name":"getIndexCode","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"cell"}]},{"name":"resolveIndexCodeHash","inputs":[{"name":"answerId","type":"uint32"},{"name":"saltKey","type":"string"},{"name":"saltValue","type":"cell"}],"outputs":[{"name":"value0","type":"uint256"}]},{"name":"deploy_nonce","inputs":[],"outputs":[{"name":"deploy_nonce","type":"uint128"}]},{"name":"instances_deployed","inputs":[],"outputs":[{"name":"instances_deployed","type":"uint128"}]}],"data":[{"key":1,"name":"deploy_nonce","type":"uint128"},{"key":2,"name":"instanceCode","type":"cell"}],"events":[{"name":"IndexDeployed","inputs":[{"name":"index","type":"address"},{"name":"indexedContract","type":"address"},{"name":"indexCodeHash","type":"uint256"},{"name":"saltKey","type":"string"},{"name":"saltValue","type":"cell"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_indexDeployValue","type":"uint128"},{"name":"_indexDestroyValue","type":"uint128"},{"name":"_indexCode","type":"cell"},{"name":"deploy_nonce","type":"uint128"},{"name":"instanceCode","type":"cell"},{"name":"instances_deployed","type":"uint128"}]} as const
const indexAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[],"outputs":[]},{"name":"getIndexedContract","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"getIndexFactory","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"address"}]},{"name":"getCodeHash","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"value0","type":"uint256"}]},{"name":"destruct","inputs":[{"name":"gasReceiver","type":"address"}],"outputs":[]}],"data":[{"key":1,"name":"_indexedContract","type":"address"},{"key":2,"name":"_saltHash","type":"uint256"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_indexedContract","type":"address"},{"name":"_saltHash","type":"uint256"},{"name":"_indexFactory","type":"address"}]} as const
const instanceAbi = {"ABIversion":2,"version":"2.2","header":["time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"_user","type":"address"},{"name":"_creator","type":"address"}],"outputs":[]},{"name":"getDetails","inputs":[],"outputs":[{"name":"_user","type":"address"},{"name":"_creator","type":"address"},{"name":"_nonce","type":"uint128"},{"name":"_factory","type":"address"}]}],"data":[{"key":1,"name":"nonce","type":"uint128"},{"key":2,"name":"factory","type":"address"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"nonce","type":"uint128"},{"name":"factory","type":"address"},{"name":"user","type":"address"},{"name":"creator","type":"address"}]} as const

export const factorySource = {
    Factory: factoryAbi,
    Index: indexAbi,
    Instance: instanceAbi
} as const

export type FactorySource = typeof factorySource
export type FactoryAbi = typeof factoryAbi
export type IndexAbi = typeof indexAbi
export type InstanceAbi = typeof instanceAbi
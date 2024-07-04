import { SSVKeys, KeyShares, KeySharesItem } from "ssv-keys";
import { NonceScanner } from "ssv-scanner";
import fs from "fs";
import path from "path";

/**
 * using ssv-keys package to split keystore file to keyshares
 * 
 * @param keystoreFile
 * @param password 
 * 
 * @returns keyshare files
 *          
 */
const splitKeystoreFile = async (publicKey: string, privateKey: string, operatorIDs: number[], operatorKeys: string[], ownerAddress: string, nonce: number): Promise<any> => {
  const ssvKeys = new SSVKeys();
  const keySharesItem = new KeySharesItem();
  const keyShares = new KeyShares();

  const operators = operatorKeys.map((operator: any, index: any) => ({
    id: operatorIDs[index],
    operatorKey: operator,
  }));
  
  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  // Build final web3 transaction payload and update keyshares file with payload data
  await keySharesItem.buildPayload({
    publicKey,
    operators,
    encryptedShares,
  }, {
    ownerAddress: ownerAddress,
    ownerNonce: nonce,
    privateKey
  });

  // Keyshares
  keySharesItem.update({
    ownerAddress: ownerAddress,
    ownerNonce: nonce,
    operators,
    publicKey
  });

  keyShares.add(keySharesItem);

  return keyShares.toJson();
}

/** get user keys from keystore file
 * 
 * 
 * @param keystoreFile
 * @param password 
 * 
 * @returns Returns a Promise<string> that includes the path to the file if found. Returns empty
 *          string if not found.
 */
const getUserKeys = async (keystoreData: string, password: string) => {
  const ssvKeys = new SSVKeys();
  const { publicKey, privateKey } = await ssvKeys.extractKeys(keystoreData, password)
  return { privateKey, publicKey }
}

/**
 * get address nonce using ssv scanner
 * 
 * @param ownerAddress
 * @param network 
 * @param nodeUrl 
 * 
 * @returns nonce
 *          
 */
const getAddressNonce = async (network: string, ownerAddress: string, nodeUrl: string): Promise<number> => {
  const params = {
    network: network,
    nodeUrl: nodeUrl,
    ownerAddress: ownerAddress,
  }

  const nonceScanner = new NonceScanner(params);
  const nextNonce = await nonceScanner.run();

  return nextNonce;
};

interface SaveShareFileOptions {
  path: string;
  data: any;
}
/**
 * save keyshare files to disk
 * 
 * @param options
 * 
 * @returns success or error
 *          
*/
const saveShareFile = (options: SaveShareFileOptions) => {
  const timestamp = Date.now();
  let filePath = path.join(options.path, `keyshare_${timestamp}.json`);
  
  try {
    fs.writeFileSync(path.resolve(filePath), options.data);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export {
  splitKeystoreFile,
  getUserKeys,
  getAddressNonce,
  saveShareFile
}
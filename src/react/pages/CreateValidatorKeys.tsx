import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { CreateMnemonicFlow, ExistingMnemonicFlow, paths, ETH_TO_GWEI } from "../constants";
import { GlobalContext } from "../GlobalContext";
import { KeyCreationContext } from "../KeyCreationContext";
import { NetworkTypeConfig } from "../../types.config";

import FolderSelector from "../components/FolderSelector";
import Loader from "../components/Loader";
import WizardWrapper from "../components/WizardWrapper";
import config from "../../config";

type ErrorType = {
  stderr?: string;
  message?: string;
};

/**
 * Allows the user to select a destination folder for the validator keys.
 * After which the user can attempt to generate the keys.
 */
const CreateValidatorKeys = () => {
  const {
    setFolderLocation,
    amount,
    index,
    numberOfKeys,
    mnemonic,
    password,
    withdrawalAddress,
    compounding,
  } = useContext(KeyCreationContext);
  const { network, nonce, setNonce } = useContext(GlobalContext);
  const history = useHistory();
  const usingExistingFlow = history.location.pathname === paths.CREATE_KEYS_EXISTING;
  const location = useLocation();
  const operatorData = (location.state as any)?.data;
  const networkKey = network.toLowerCase() as keyof NetworkTypeConfig;

  const [creatingKeys, setCreatingKeys] = useState(false);
  const [generationError, setGenerationError] = useState<string | undefined>("");
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    if (!mnemonic) {
      history.replace(usingExistingFlow ? paths.EXISTING_IMPORT : paths.CREATE_MNEMONIC);
    }
  }, []);

  const onFolderSelect = (folder: string) => {
    setSelectedFolder(folder);
  };

  const handleError = (error: ErrorType) => {
    const errorMsg = 'stderr' in error ? error.stderr : error.message;
    setGenerationError(errorMsg);
    setCreatingKeys(false);
  };

  /**
   * Will attempt to generate the validator keys with the provided folder and if successful
   * will send the user to the final step of the flow
   * 
   */
  const createKeys = async () => {
    setCreatingKeys(true);
  
    let appendedWithdrawalAddress = withdrawalAddress;
  
    if (withdrawalAddress !== "" && !withdrawalAddress.toLowerCase().startsWith("0x")) {
      appendedWithdrawalAddress = "0x" + withdrawalAddress;
    }

    // Convert user provided amount to integer representation of gwei
    const gweiAmount = parseInt((amount * ETH_TO_GWEI).toString());
  
    try {
      const data = await window.eth2Deposit.generateKeysAndKeystore(
        mnemonic,
        index,
        gweiAmount,
        numberOfKeys,
        network,
        password,
        appendedWithdrawalAddress,
        compounding,
        selectedFolder
      );
  
      const keystoreJsonArray = JSON.parse(data.stdout);
  
      try {
        await processKeystoreFileJsonArray(keystoreJsonArray);
      } catch (error: any) {
        handleError(error);
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setCreatingKeys(false);
    }
  };

  const processOperatorData = (operatorData: any) => {
    const ids = [];
    const publicKeys = [];

    for (const key in operatorData) {
      if (Object.hasOwnProperty.call(operatorData, key)) {
        const item = operatorData[key];
        if (item.id && item.public_key) {
          ids.push(item.id);
          publicKeys.push(item.public_key);
        }
      }
    }
    return { ids, publicKeys };
  }

  /**
   * Asynchronously processes a single keystore file JSON string.
   *
   * @param {string} jsonString - A JSON string representing a keystore file.
   * @param {number} currentNonce - The nonce to use for processing the keystore file.
   * @returns {Promise<void>} - A promise that resolves when the keystore file has been processed.
  */
  const processKeystoreFileString = async (jsonString: string, currentNonce: number): Promise<void> => {
    const jsonObject = JSON.parse(jsonString);
    const { ids, publicKeys } = processOperatorData(operatorData);

    const result = await window.ssvKeys.getUserKeys(jsonObject, password);
    
    const keyshare = await window.ssvKeys.splitKeystore(result.publicKey, result.privateKey, ids, publicKeys, config.network[networkKey].ownerAddress, currentNonce);
    
    setFolderLocation(selectedFolder);
    return await window.ssvKeys.saveShareFile({
      path: selectedFolder,
      data: keyshare,
    });
  };
  
  /**
   * Asynchronously processes an array of keystore file JSON strings.
   *
   * @param {string[]} keystoreFileArray - An array of JSON strings representing keystore files.
   * @returns {Promise<void>} - A promise that resolves when all keystore files have been processed.
  */
  const processKeystoreFileJsonArray = async (keystoreFileArray: string[]): Promise<void> => {
    let currentNonce = nonce;

    await keystoreFileArray.reduce(async (promiseChain: Promise<void>, jsonString: string) => {
      // Wait for the previous promise to resolve to ensure sequential execution
      await promiseChain;
      
      // Process the current keystore file string with the current nonce
      await processKeystoreFileString(jsonString, currentNonce);

      currentNonce += 1;
      setNonce(currentNonce);

      // Return a resolved promise to continue the chain
      return Promise.resolve();
    }, Promise.resolve());// Initial value is a resolved promise to start the chain
    
    history.replace(usingExistingFlow ? paths.FINISH_EXISTING : paths.FINISH_CREATE);
  };

  const onBackClick = () => {
    setFolderLocation("");
    history.goBack();
  };

  const onNextClick = () => {
    if (selectedFolder) {
      createKeys();
    }
  };

  return (
    <WizardWrapper
      actionBarItems={creatingKeys ? [] : [
        <Button variant="text" color="info" onClick={() => onBackClick()} tabIndex={2} startIcon={<KeyboardArrowLeft />}>Back</Button>,
        <Button variant="contained" color="primary" disabled={!selectedFolder} onClick={() => onNextClick()} tabIndex={3}>Save</Button>,
      ]}
      activeTimelineIndex={3}
      timelineItems={usingExistingFlow ? ExistingMnemonicFlow : CreateMnemonicFlow}
      title="Create Keys"
    >
      {creatingKeys ? (
        <Loader message="The duration of this process depends on how many keys you are generating and the performance of your computer.  Generating one key takes about 30 seconds.  Generating 100 keys may take about 10 minutes." />
      ) : (
        <div className="tw-flex tw-flex-col tw-gap-4">
          <Typography className="tw-text-lg tw-mb-6 tw-ml-14">Choose a folder where we should save your keys.</Typography>

          <FolderSelector onFolderSelect={onFolderSelect} displayType="image" />
          
          <div className="tw-text-center">
            {selectedFolder ? (
              <Typography className="tw-text-lg">You've selected: {selectedFolder}</Typography>
            ) : (
              <div className="tw-text-lg tw-flex tw-justify-center">
                <FolderSelector onFolderSelect={onFolderSelect} displayType="text" />
              </div>
            )}
            {generationError && (
              <div className="tw-text-center tw-mt-2">
                <Typography color="error">{generationError}</Typography>
              </div>
            )}
          </div>
        </div>
      )}
    </WizardWrapper>
  )
};

export default CreateValidatorKeys;
import { useContext, useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { GlobalContext } from "../GlobalContext";
import { handleOperatorRequest } from "../utils";
import { clearImageCache } from '../utils/imageCache';

import config from "../../config";
import WagyuModal from "./WagyuModal";

import { NetworkTypeConfig } from "../../types.config";
import { EXPIRATION_TIME, errors } from "../constants";

import errorSvg from "../../assets/images/error.svg";

interface SyncOperatorModalParams {
  onClose: () => void;
  onSkip: () => void;
  onError: () => void;
  onCancel: () => void;
  showModal: boolean;
}

export interface OperatorRequestParams {
  type?: string;
  search?: string;
  has_dkg_address?: boolean;
  network: string;
}

/**
 * Modal to allow the user to sync operators
 */
const SyncOperatorModal = ({onClose, onSkip, onError, onCancel, showModal}: SyncOperatorModalParams) => {
  const [progress, setProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { network, setOperatorList, setNonce, operatorList, operatorMeta, setOperatorMeta } = useContext(GlobalContext);
  const networkKey = network.toLowerCase() as keyof NetworkTypeConfig;

  const CircularProgressWithLabel = (props: any) => {
    return isCompleted && progress === 0 ? <img className="tw-w-1/5" src={errorSvg} /> : (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={60} variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" className="tw-font-semibold tw-text-base">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const isShowSkipButton = () => {
    const isDataValid = operatorMeta.expiration > Date.now();
    const isNetworkMatch = operatorMeta.network === network;
  
    return isDataValid && isNetworkMatch;
  };

  /**
   * Handles the confirmation and synchronization of the operator.
   * 
   * This function performs the following steps:
   * 1. Initializes the progress and sets the syncing state.
   * 2. Constructs the parameters and URL for the operator request.
   * 3. Calls SSV operator API to start the operator synchronization.
   * 4. Updates the operator list and nonce based on the response.
   * 5. Sets the operator meta information with an expiration time.
   * 6. Handles errors and sets appropriate error messages.
   * 7. Resets the syncing state and marks the process as completed.
   * 
   * @async
   * @function handleConfirmSyncOperator
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} If the request fails, an error message is set based on the type of error.
  */
  const handleConfirmSyncOperator = async (): Promise<void> => {
    try {
      setProgress(0);
      setIsSyncing(true);
      setIsConfirmed(true);
      setIsCompleted(false);

      // clear cache
      window.electronAPI.clearCache();
      clearImageCache();

      const { data, nextNonce } = await handleOperatorRequest(
        setProgress,
        network,
        config.network[networkKey].ownerAddress,
      );

      setOperatorList(data);
      setNonce(nextNonce);
      
      setOperatorMeta({ network, expiration: Date.now() + EXPIRATION_TIME });
    } catch (error: any) {
      let errorMessage = errors.UNEXPECTED_ERROR;
      if (error.message === errors.SIMPLE_NETWORK_ERROR) {
        errorMessage = errors.NETWORK_ERROR
      }

      setErrorMsg(errorMessage);
    } finally {
      setIsCompleted(true);
      setIsSyncing(false);
    }
  }

  const handleCloseModal = () => {
    setIsConfirmed(false);
    setIsCompleted(false);
    setProgress(0);
    onError();
  }

  return (
    <WagyuModal
      className="tw-w-[800px] tw-h-[450px]"
      open={showModal}
    >
      <div>
        <div className="tw-text-2xl tw-my-7">
          {isCompleted ? (progress === 0 ? "Synchronization failed(;-;)" : "Synchronized completion") : isSyncing ? "Synchronizing..." : "Do you want to synchronize your operators?"}
        </div>
        <div className="tw-px-12 tw-text-lg tw-text-left">
          {isCompleted && progress === 0 ? (
            <div>{errorMsg}</div>
          ) : (
            <>
              <div>Please note that synchronization requires a short period of Internet connection, it is recommended to continue subsequent operations as soon as possible after the completion of synchronization, otherwise changes in synchronization information may lead to loss of your properties.</div>
              <div className="tw-text-grayText tw-mt-4">You can disconnect from the Internet after the completion of synchronization.</div>
            </>
          )}
        </div>

        { isConfirmed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgressWithLabel value={progress} sx={{color: '#00CDD0'}} />
        </Box>
        )}

        <div style={{ textAlign: 'center', marginTop: !isSyncing && !isConfirmed ? 96 : isCompleted && progress === 0 ? 96 :36 }}>
          {!isSyncing && !isConfirmed && (
            <div>
              {operatorList.length > 0 && isShowSkipButton() && (
                <Button onClick={onSkip} color="info" className="tw-mr-4">
                  Skip
                </Button>
              )}

              {operatorList.length === 0 && (
                <Button onClick={onCancel} color="info" className="tw-mr-4">
                  Cancel
                </Button>
              )}
              
              <Button variant="contained" onClick={handleConfirmSyncOperator} color="primary" autoFocus>
                Yes, let me synchronize
              </Button>
            </div>
          )}

          {isSyncing && progress > 0 && (
            <div className="tw-flex tw-justify-center">
              <div className="tw-h-10 tw-leading-10 tw-text-[#96969F] tw-bg-[#202024] tw-w-1/3 tw-rounded-md">Just a second ...</div>
            </div>
          )}

          {isCompleted && progress === 100 && (
            <Button variant="contained" color="primary" onClick={onClose} autoFocus>Done</Button>
          )}

          {isCompleted && progress !== 100 && !isSyncing && (
            <div>
              <Button onClick={handleCloseModal} color="info" className="tw-mr-4">
                Close
              </Button>
              <Button variant="contained" color="primary" onClick={handleConfirmSyncOperator} autoFocus>Try again</Button>
            </div>
          )}
        </div>

      </div>
    </WagyuModal>
  )
};

export default SyncOperatorModal;
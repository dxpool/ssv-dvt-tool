import { Button, Tooltip, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { paths, tooltips } from "../constants";
import { GlobalContext } from "../GlobalContext";
import { HomePageImage } from "../icons/HomePageImage";
import { ReuseMnemonicAction } from "../types";

import NetworkPickerModal from "../modals/NetworkPickerModal";
import SyncOperatorModal from "../modals/SyncOperatorModal";
import ReuseMnemonicActionModal from "../modals/ReuseMnemonicActionModal";

/**
 * Landed page of the application.
 * The user will be able to select a network and choose the primary action
 * they wish to make.
 */
const Home = () => {
  const [showSyncOperatorModal, setSyncOperatorDialogOpen] = useState(false);
  const [wasSyncOperatorModalOpened, setWasSyncOperatorModalOpened] = useState(false);
  const [wasNetworkModalOpened, setWasNetworkModalOpened] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showReuseMnemonicModal, setShowReuseMnemonicModal] = useState(false);
  const { network } = useContext(GlobalContext);

  let history = useHistory();

  const tabIndex = useMemo(() => showNetworkModal ? -1 : 1, [showNetworkModal]);

  // start process by open sync operator dialog 
  const handleOpenSyncModal = () => {
    setSyncOperatorDialogOpen(true);
    setWasSyncOperatorModalOpened(true);
  };

  // choose network modal
  const handleOpenNetworkModal = () => {
    if (wasNetworkModalOpened) return;
    setShowNetworkModal(true);
    setWasNetworkModalOpened(true);
  };

  const handleCloseNetworkModal = () => {
    setShowNetworkModal(false);
    handleOpenSyncModal();
  };

  const handleCloseSyncOperatorDialog = () => {
    setSyncOperatorDialogOpen(false);
  }

  const handleSyncSkip = () => {
    setSyncOperatorDialogOpen(false);
    setWasSyncOperatorModalOpened(true);
  }

  const handleResetSyncDialog = () => {
    setSyncOperatorDialogOpen(false);
    setWasSyncOperatorModalOpened(false);
    setWasNetworkModalOpened(false);
  }

  const handleCreateNewMnemonic = () => {
    history.push(paths.CREATE_MNEMONIC);
  };

  const handleUseExistingMnemonic = () => {
    setShowReuseMnemonicModal(true);
  };

  const handleCloseReuseActionModal = () => {
    setShowReuseMnemonicModal(false);
  };

  const handleReuseMnemonicActionSubmit = (action: ReuseMnemonicAction) => {
    setShowReuseMnemonicModal(false);
    if (action === ReuseMnemonicAction.RegenerateKeys) {

      history.push(paths.EXISTING_IMPORT);
    } else if (action === ReuseMnemonicAction.GenerateBLSToExecutionChange) {

      history.push(paths.BTEC_IMPORT);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-pt-8">
      <div className="tw-pr-8 tw-text-right tw-w-full">
        <span className="tw-text-gray tw-text-sm">Select Network:</span>{" "}

        <Button color="primary" onClick={handleOpenNetworkModal} tabIndex={tabIndex}>
          {network}
        </Button>
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <div className="tw-w-full tw-max-w-md">
          <HomePageImage />
        </div>

        <Typography variant="h6" className="tw-mt-12">Your key generator for staking on Ethereum</Typography>
        <Typography className="tw-w-1/3 tw-text-center tw-mt-2">
          <Tooltip title={tooltips.SYNC_AND_OFFLINE}>
            <span>Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity.</span>
          </Tooltip>
        </Typography>

        {!wasSyncOperatorModalOpened && (
          <Button
            variant="contained"
            color="primary"
            className="tw-mt-10"
            onClick={handleOpenNetworkModal}
            tabIndex={tabIndex}
          >
            Start the process
          </Button>
        )}

        {wasSyncOperatorModalOpened && (
          <>
            <Button
              variant="contained"
              color="primary"
              className="tw-mt-10"
              onClick={handleCreateNewMnemonic}
              tabIndex={tabIndex}
            >
              Create new secret recovery phrase
            </Button>

            <Tooltip title={tooltips.IMPORT_MNEMONIC}>
              <Button
                className="tw-text-gray tw-mt-2"
                size="small"
                onClick={handleUseExistingMnemonic}
                tabIndex={tabIndex}
              >
                Use Existing Secret Recovery Phrase
              </Button>
            </Tooltip>
          </>
        )}
      </div>

      <NetworkPickerModal
        onClose={handleCloseNetworkModal}
        showModal={showNetworkModal}
      />

      <SyncOperatorModal
        onSkip={handleSyncSkip}
        onClose={handleCloseSyncOperatorDialog}
        onCancel={handleResetSyncDialog}
        onError={handleResetSyncDialog}
        showModal={showSyncOperatorModal}
      />

      <ReuseMnemonicActionModal
        onClose={handleCloseReuseActionModal}
        onSubmit={handleReuseMnemonicActionSubmit}
        showModal={showReuseMnemonicModal}
      />
    </div>
  )
};

export default Home;
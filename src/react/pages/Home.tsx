import { Button, Tooltip, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { paths, tooltips } from "../constants";
import { GlobalContext } from "../GlobalContext";
import { HomePageImage } from "../icons/HomePageImage";
import { ReuseMnemonicAction } from "../types";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  const [shouldOpenSyncAfterNetwork, setShouldOpenSyncAfterNetwork] = useState(false);
  const [isManualNetworkOpen, setIsManualNetworkOpen] = useState(false);
  const { network } = useContext(GlobalContext);

  let history = useHistory();

  const tabIndex = useMemo(() => showNetworkModal ? -1 : 1, [showNetworkModal]);

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
    // setShowReuseMnemonicModal(false);
    if (action === ReuseMnemonicAction.RegenerateKeys) {
      history.push(paths.EXISTING_IMPORT);handleStartProcess
    } else if (action === ReuseMnemonicAction.GenerateBLSToExecutionChange) {
      history.push(paths.BTEC_IMPORT);
    }
  };

  // start process by open sync operator dialog 
  const handleOpenSyncModal = () => {
    setSyncOperatorDialogOpen(true);
    setWasSyncOperatorModalOpened(true);
  };

  const handleOpenNetworkModal = (isManual = false) => {
    setShowNetworkModal(true);
    setIsManualNetworkOpen(isManual);
  };

  const handleCloseNetworkModal = () => {
    setShowNetworkModal(false);
    setWasNetworkModalOpened(true);
    if (shouldOpenSyncAfterNetwork && !isManualNetworkOpen) {
      handleOpenSyncModal();
    }
    setShouldOpenSyncAfterNetwork(false); // reset should open sync flag
    setIsManualNetworkOpen(false); // reset manual open network flag
  };

  const handleStartProcess = () => {
    if (wasNetworkModalOpened) {
      handleOpenSyncModal();
    } else {
      setShouldOpenSyncAfterNetwork(true); // open sync after network is selected
      handleOpenNetworkModal(false); // mark as none manual open
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-pt-4">
      <div className="tw-pr-8 tw-text-right tw-w-full">
        <span className="tw-text-gray tw-text-sm">Select Network:</span>{" "}

        <Button color="primary" onClick={() => handleOpenNetworkModal(true)}  tabIndex={tabIndex}>
          {network}
        </Button>
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <div className="tw-flex tw-justify-center tw-w-full tw-mt-4">
          <HomePageImage />
        </div>

        <Typography variant="h5" className="tw-mt-10 tw-font-bold">Your key generator for staking on Ethereum</Typography>
        <Typography className="tw-w-1/2 tw-text-center tw-mt-2">
          <span>
            <span className="tw-text-lg">Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity.</span>
            <Tooltip title={<span style={{ fontSize: '0.85rem' }}>{tooltips.SYNC_AND_OFFLINE}</span>} placement="top-end">
              <InfoOutlinedIcon className="tw-ml-1 tw-cursor-pointer tw-align-middle tw-h-4" sx={{color: '#A4A4A4'}} />
            </Tooltip>
          </span>
        </Typography>

        {!wasSyncOperatorModalOpened && (
          <Button
            variant="contained"
            color="primary"
            className="tw-mt-10"
            onClick={handleStartProcess}
            tabIndex={tabIndex}
            sx={{ width: '200px' }}
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
              Generate new mnemonic for validator maintenance
            </Button>

            <Tooltip title={tooltips.IMPORT_MNEMONIC} placement="right">
              <Button
                className="tw-text-gray tw-mt-2"
                size="small"
                onClick={() => handleReuseMnemonicActionSubmit(ReuseMnemonicAction.RegenerateKeys)}
                tabIndex={tabIndex}
              >
                Use Existing mnemonic for validator maintenance
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
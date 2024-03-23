import { useContext, useMemo, useState } from "react";
import { GlobalContext } from "../globalContext";
import { Button, Tooltip, Typography } from "@mui/material";
import NetworkPickerModal from "../modals/NetworkPickerModal";
import { KeyIcon } from "../icons/KeyIcon";
import { tooltips } from "../constants";
import ReuseMnemonicActionModal from "../modals/ReuseMnemonicActionModal";
import { ReuseMnemonicAction } from "../types";

const Home = () => {
  const { network } = useContext(GlobalContext);
  const [wasNetworkModalOpened, setWasNetworkModalOpened] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showReuseMnemonicModal, setShowReuseMnemonicModal] = useState(false);
  const [createMnemonicSelected, setCreateMnemonicSelected] = useState(false);
  const [useExistingMnemonicSelected, setUseExistingMnemonicSelected] = useState(false);

  const tabIndex = useMemo(() => showNetworkModal ? -1 : 1, [showNetworkModal]);

  const handleOpenNetworkModal = () => {
    setShowNetworkModal(true);
    setWasNetworkModalOpened(true);
  };

  const handleCloseNetworkModal = () => {
    setShowNetworkModal(false);
    if (createMnemonicSelected) {
      handleCreateNewMnemonic();
    } else if (useExistingMnemonicSelected) {
      handleUseExistingMnemonic();
    }
  };

  const handleCreateNewMnemonic = () => {
    setCreateMnemonicSelected(true);

    if (!wasNetworkModalOpened) {
      handleOpenNetworkModal();
    } else {

    }
  };

  const handleUseExistingMnemonic = () => {
    setUseExistingMnemonicSelected(true);

    if (!wasNetworkModalOpened) {
      handleOpenNetworkModal();
    } else {
      setShowReuseMnemonicModal(true);
    }
  };

  const handleCloseReuseActionModal = () => {
    setShowReuseMnemonicModal(false);
  };

  const handleReuseMnemonicActionSubmit = (action: ReuseMnemonicAction) => {
    setShowReuseMnemonicModal(false);
  };

  return (
    <div className="tw-flex tw-flex-col tw-pt-8">
      <div className="tw-pr-8 tw-text-right tw-w-full">
        <span className="tw-text-gray tw-text-sm">Select Network:</span>{" "}
        <Button
          color="primary"
          onClick={handleOpenNetworkModal}
          tabIndex={tabIndex}
        >
          {network}
        </Button>
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <Typography className="tw-text-4xl tw-mb-5" variant="h1">Weclome!</Typography>

        <KeyIcon />

        <Typography className="tw-mt-2">Your key generator for staking on Ethereum.</Typography>
        <Typography>
          You should run this tool{" "}
          <Tooltip title={tooltips.OFFLINE}>
            <span className="tw-underline">offline</span>
          </Tooltip>{" "}
          for your own security.
        </Typography>

        <div className="tw-mt-5">
          <div>
            <span className="tw-text-gray">Github:</span>{" "}
            <span className="tw-text-sm">https://github.com/stake-house/wagyu-key-gen</span>
          </div>
          <div>
            <span className="tw-text-gray">Support:</span>{" "}
            <span className="tw-text-sm">https://dsc.gg/ethstaker</span>
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          className="tw-mt-5"
          onClick={handleCreateNewMnemonic}
          tabIndex={tabIndex}
        >
          Create New Secret Recovery Phrase
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
      </div>

      <NetworkPickerModal
        onClose={handleCloseNetworkModal}
        showModal={showNetworkModal}
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

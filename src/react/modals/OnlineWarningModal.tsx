import { Button, Typography } from "@mui/material";

import WagyuModal from "./WagyuModal";

interface OnlineWarningModalParams {
  onClose: () => void;
  onHideWarning: () => void;
  open: boolean;
}

/**
 * Modal to display to the user to explain the risks of using this tool with network connectivity
 */
const OnlineWarningModal = ({ onClose, onHideWarning, open }: OnlineWarningModalParams) => (
  <WagyuModal
    className="tw-w-[600px]"
    open={open}
  >
    <div className="tw-py-8 tw-px-8">
      <div className="tw-text-2xl tw-font-semibold tw-text-center tw-mb-6">Internet Connection Detected</div>
      <div className="tw-text-left tw-min-h-[250px]">
        <Typography className="tw-mb-2" variant="body1">
          Being connected to the internet while using this tool drastically increases the risk of exposing your Secret Recovery Phrase.
        </Typography>
        <Typography variant="body1">
          You can avoid this risk by having a live OS such as Tails installed on a USB drive and run on a computer with network capabilities disabled.
        </Typography>

        <Typography className="tw-mt-6 tw-mb-2" variant="body1">
          You can visit https://tails.net/install/ for instructions on how to download, install, and run Tails on a USB device.
        </Typography>
        <Typography variant="body1">
          If you have any questions you can get help at https://stake.dxpool.com
        </Typography>
      </div>
      <div className="tw-flex tw-items-center tw-justify-center">
        <Button
          color="primary"
          onClick={() => onHideWarning()}
          variant="contained"
        >
          Confirm
        </Button>
      </div>
    </div>
  </WagyuModal>
);

export default OnlineWarningModal;
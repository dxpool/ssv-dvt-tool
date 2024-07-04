import { Button, Typography } from "@mui/material";
import WagyuModal from "./WagyuModal";

interface ExpireModalParams {
  onConfirm: () => void;
  open: boolean;
}

/**
 * Modal to display to the user when the operatorMeta expiration is detected.
 */
const ExpireModal = ({ onConfirm, open }: ExpireModalParams) => (
  <WagyuModal className="tw-w-[600px]" open={open}>
    <div className="tw-py-8 tw-px-8">
      <div className="tw-text-2xl tw-font-semibold tw-text-center tw-mb-6">Operator List Expired</div>
      <div className="tw-text-left tw-min-h-[150px]">
        <Typography className="tw-mb-2" variant="body1">
          The synchronized operator list has expired. Please synchronize it again。
        </Typography>
      </div>
      <div className="tw-flex tw-items-center tw-justify-center">
        <Button color="primary" onClick={onConfirm} variant="contained">
          Confirm
        </Button>
      </div>
    </div>
  </WagyuModal>
);

export default ExpireModal;
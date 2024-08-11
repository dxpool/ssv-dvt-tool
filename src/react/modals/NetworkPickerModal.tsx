import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "../GlobalContext";
import { Network } from "../types";
import WagyuModal from "./WagyuModal";

interface NetworkPickerModalParams {
  onClose: () => void;
  showModal: boolean;
}

/**
 * Modal to allow the user to pick the Ethereum Network
 */
const NetworkPickerModal = ({onClose, showModal}: NetworkPickerModalParams) => {
  const { network, setNetwork } = useContext(GlobalContext);
  const [formNetwork, setFormNetwork] = useState<Network>(Network.HOLESKY);

  useEffect(() => {
    if (network) {
      setFormNetwork(network);
    }
  }, [network, showModal]);

  const onNetworkChange = (selected: React.ChangeEvent<HTMLInputElement>) => {
    const selectedNetwork = selected.target.value as Network;

    if (selectedNetwork) {
      setFormNetwork(selectedNetwork);
    }
  };

  const onSubmit = () => {
    if (formNetwork) {
      setNetwork(formNetwork);
    }

    onClose();
  };

  return (
    <WagyuModal
      className="tw-w-[420px] tw-h-[444px]"
      open={showModal}
    >
      <div>
        <div className="tw-text-2xl tw-mt-8 tw-mb-12">Confirm Your Network</div>
        <FormControl variant="standard" focused>
          <RadioGroup aria-label="gender" name="gender1" value={formNetwork} onChange={onNetworkChange}>
            <FormControlLabel value={Network.MAINNET} control={<Radio />} label={Network.MAINNET} disabled sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 28,
              },
              '& .MuiFormControlLabel-label': {
                fontSize: '1.125rem',
                textAlign: 'center',
                flex: 1,
              },
              display: 'flex',
              justifyContent: 'center',
            }}  />
            <FormControlLabel value={Network.HOLESKY} control={<Radio />} label={Network.HOLESKY + ' (Testnet)'}sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 28,
              },
              '& .MuiFormControlLabel-label': {
                fontSize: '1.125rem',
                textAlign: 'center',
                marginLeft: '1rem',
                flex: 1,
              },
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
              marginTop: '3rem',
            }}  />
          </RadioGroup>

          <div className="tw-flex tw-justify-center tw-mt-12">
            <Button className="tw-w-[120px] tw-h-10 tw-rounded-md" color="primary" onClick={onSubmit} variant="contained" tabIndex={1}>
              Confirm
            </Button>
          </div>
          
        </FormControl>
      </div>
    </WagyuModal>
  )
};

export default NetworkPickerModal;
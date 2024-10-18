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
const NetworkPickerModal = ({ onClose, showModal }: NetworkPickerModalParams) => {
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
      className="tw-w-[280px] tw-h-[250px]"
      open={showModal}
    >
      <div>
        <div className="tw-text-xl tw-mt-6 tw-mb-6">Confirm Your Network</div>
        <FormControl variant="standard" focused>
          <RadioGroup
            aria-label="network"
            name="network"
            value={formNetwork}
            onChange={onNetworkChange}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <FormControlLabel
              value={Network.MAINNET}
              control={<Radio />}
              label={Network.MAINNET}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 24,
                  '&.Mui-disabled': {
                    color: '#9e9e9e',
                  },
                },
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  color: 'inherit',
                  '&.Mui-disabled': {
                    color: '#9e9e9e',
                  },
                },
                paddingLeft: '0',
              }}
            />
            <FormControlLabel
              value={Network.HOLESKY}
              control={<Radio />}
              label={Network.HOLESKY + ' (Testnet)'}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 24,
                },
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                },
                paddingLeft: '0',
                marginBottom: '0.5rem',
                marginTop: '0.5rem',
              }}
            />
          </RadioGroup> 

          <div className="tw-flex tw-justify-center tw-mt-4">
            <Button className="tw-w-[100px] tw-h-9 tw-rounded-md" color="primary" onClick={onSubmit} variant="contained" tabIndex={1}>
              Confirm
            </Button>
          </div>

        </FormControl>
      </div>
    </WagyuModal>

  )
};

export default NetworkPickerModal;
import React from "react";

import { Tooltip, TooltipProps, tooltipClasses, Avatar, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RELAYER_IMAGE_MAP } from "../constants";

const MevRelayerTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 16,
    maxWidth: 480,
    maxHeight: 400,
    wordWrap: 'break-word',
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const MevRelayerContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});

interface MevRelayerTooltipProps {
  mevRelays: string;
}

const MevRelayerTooltipComponent: React.FC<MevRelayerTooltipProps> = ({ mevRelays }) => {
  const count = mevRelays ? mevRelays.split(',').length : 0;

  return (
    <div className="tw-flex tw-justify-center tw-items-center">
      <MevRelayerTooltip
        title={
          count > 0 && (
            <React.Fragment>
              <Typography color="inherit">Supported MEV Relays</Typography>
              <Stack direction="row" spacing={1}>
                <MevRelayerContainer>
                  {mevRelays.split(',').map((relayer: string, index: number) => (
                    <div key={index} className="tw-flex tw-items-center tw-mt-4 tw-mr-2">
                      <Avatar sx={{ width: 24, height: 24 }} src={RELAYER_IMAGE_MAP[relayer]} />
                      <div className="tw-ml-2">{relayer}</div>
                    </div>
                  ))}
                </MevRelayerContainer>
              </Stack>
            </React.Fragment>
          )
        }
      >
        <div className={`tw-cursor-pointer tw-p-1 tw-rounded-md tw-w-6 tw-h-6 tw-leading-6 tw-flex tw-justify-center tw-items-center ${count > 0 ? 'mev-container' : 'no-mev-container'}`}>
          {count}
        </div>
      </MevRelayerTooltip>
    </div>
  );
};

export default MevRelayerTooltipComponent;
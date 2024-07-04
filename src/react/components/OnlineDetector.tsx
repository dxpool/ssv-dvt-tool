import { Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";

import URLChecker from "network-checker-tool";
import OnlineWarningModal from "../modals/OnlineWarningModal";

/**
 * This will add an event listener to detect the users internet connectivity.
 * If active, a pulsing warning icon with text will appear on the screen that
 * when clicked will show a modal to warn the user of the danger of internet
 * connectivity.
 */
export const OnlineDetector = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [showWarning, setShowWarning] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checker = new URLChecker((isOnline: boolean) => {
      setShowWarning(isOnline);
    });

    return () => {
      checker.stopChecking();
    };
  }, []);

  const onHideWarning = () => {
    setOpen(false);
    setShowWarning(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {showWarning && (
        <Button className="tw-w-[210px] tw-h-[50px] tw-cursor-pointer tw-text-orange" onClick={() => setOpen(true)}>
          <div className="tw-absolute tw-w-0 tw-h-0 tw-left-6 tw-bg-[rgba(250, 30, 14, 0)] tw-animate-OnlinePulse tw-rounded-full" />
          <ErrorOutlineIcon className="tw-mr-1 tw-z-10 tw-text-[#00CDD0]"/>
          <Typography variant="body1" className="tw-text-[#00CDD0]">Internet Detected</Typography>
        </Button>
      )}

      <OnlineWarningModal
        onClose={onClose}
        onHideWarning={onHideWarning}
        open={open}
      />
    </>
  );
};
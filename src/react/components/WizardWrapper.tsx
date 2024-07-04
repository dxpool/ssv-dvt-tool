import { ReactNode, useContext } from "react";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";

import { stepLabels } from "../constants";
import { GlobalContext } from "../GlobalContext";
import { StepKey } from "../types";
import { OnlineDetector } from "../components/OnlineDetector";

interface WizardWrapperParams {
  actionBarItems: ReactNode[];
  activeTimelineIndex: number;
  children: ReactNode;
  timelineItems: StepKey[];
  title: string;
}

/**
 * Wrapper of a page to display the network, title, stepper, and action bar buttons.
 *
 * @param actionBarItems A list of buttons to display
 * @param activeTimelineIndex The index of the timelineItems array that is active
 * @param children The inner content of the page
 * @param timelineItems A list of steps to display
 * @param title The title to appear at the top of the page
 */
const WizardWrapper = ({
  actionBarItems,
  activeTimelineIndex,
  children,
  timelineItems,
  title,
}: WizardWrapperParams) => {
  const { network } = useContext(GlobalContext);

  return (
    <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-px-8 tw-max-w-[1580px] tw-mx-auto">
      <div className="tw-flex tw-items-center tw-mt-4 tw-mb-8">
        <OnlineDetector />
        <div className="tw-flex-grow"></div>
        <Typography variant="caption" className="tw-text-gray tw-mr-6 tw-text-lg tw-h-[50px] tw-leading-[50px]">
          Selected Network: {network}
        </Typography>
      </div>

      {children}

      <div className="tw-grow" />

      <Stepper
        activeStep={activeTimelineIndex}
        alternativeLabel
        className="tw-bg-transparent tw-my-14"
      >
        {timelineItems.map((step: StepKey, index: number) => (
          <Step key={index}>
            <StepLabel>{stepLabels[step]}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={`tw-flex tw-flex-row ${actionBarItems.length === 1 ? 'tw-justify-center' : 'tw-justify-between'} tw-px-20 tw-h-[37px]`}>
        {actionBarItems.map((item: ReactNode, index: number) => (
          <div className="tw-text-center tw-min-w-[150px]" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardWrapper;
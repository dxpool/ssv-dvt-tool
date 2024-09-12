interface LoaderParams {
  message: string;
}

/**
 * Simple loading spinner component with dynamic message
 * @param message message to display to the user
 */
const Loader = ({ message }: LoaderParams) => (
  <div className="tw-flex tw-flex-col tw-gap-8 tw-items-center">
    <div className="tw-px-12 tw-text-lg">{message}</div>

    <div className="tw-border-4 tw-border-solid tw-border-gray5 tw-border-t-teal tw-rounded-full tw-w-[50px] tw-h-[50px] tw-animate-LoaderSpin" />
  </div>
);

export default Loader;
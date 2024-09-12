import { Button, TextField, Tooltip, Typography, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, KeyboardArrowLeft } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import WizardWrapper from "../components/WizardWrapper";
import { CreateMnemonicFlow, ExistingMnemonicFlow, errors, paths, tooltips } from "../constants";
import { KeyCreationContext } from "../KeyCreationContext";

/**
 * Form to provide number of keys, index, password, and optional withdrawal address necessary to
 * complete the validator key creation process.
 *
 * User will provide the necessary inputs and a verification of the password will be done before
 * they can continue the flow
 */
const ConfigureValidatorKeys = () => {
  const {
    mnemonic,
    index,
    setIndex,
    numberOfKeys,
    setNumberOfKeys,
    password,
    setPassword,
    withdrawalAddress,
    setWithdrawalAddress,
  } = useContext(KeyCreationContext);
  const history = useHistory();
  const usingExistingFlow = history.location.pathname === paths.CONFIGURE_EXISTING;

  const [passwordToVerify, setPasswordToVerify] = useState("");
  const [passwordVerifyError, setPasswordVerifyError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [inputNumberOfKeys, setInputNumberOfKeys] = useState(numberOfKeys);
  const [inputNumberOfKeysError, setInputNumberOfKeysError] = useState(false);

  const [inputIndex, setInputIndex] = useState(index);
  const [inputIndexError, setInputIndexError] = useState(false);

  const [inputPassword, setInputPassword] = useState(password);
  const [inputPasswordStrengthError, setInputPasswordStrengthError] = useState(false);

  const [inputWithdrawalAddress, setInputWithdrawalAddress] = useState(withdrawalAddress);
  const [inputWithdrawalAddressStrengthError, setInputWithdrawalAddressStrengthError] = useState(false);
  const [inputWithdrawalAddressFormatError, setInputWithdrawalAddressFormatError] = useState(false);

  useEffect(() => {
    if (!mnemonic) {
      history.replace(usingExistingFlow ? paths.EXISTING_IMPORT : paths.CREATE_MNEMONIC);
    }
  }, [mnemonic, history, usingExistingFlow]);

  const updateNumberOfKeys = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    setInputNumberOfKeys(num);
  };

  const updateIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    setInputIndex(num);
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  const updatePasswordToVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordToVerify(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const updateEth1WithdrawAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim();
    setInputWithdrawalAddress(address);
  };

  /**
   * Validates each value simultaneously and if there are no errors will move to the next step
   */
  const validateInputs = async () => {
    let isError = false;

    if (inputNumberOfKeys < 1 || inputNumberOfKeys > 1000) {
      setInputNumberOfKeysError(true);
      isError = true;
    } else {
      setInputNumberOfKeysError(false);
    }

    if (inputPassword.length < 8) {
      setInputPasswordStrengthError(true);
      isError = true;
    } else {
      setInputPasswordStrengthError(false);
    }

    if (inputPassword !== passwordToVerify) {
      setPasswordVerifyError(true);
      isError = true;
    } else {
      setPasswordVerifyError(false);
    }

    if (inputIndex < 0) {
      setInputIndexError(true);
      isError = true;
    } else {
      setInputIndexError(false);
    }

    if (inputWithdrawalAddress !== "") {
      const isValidAddress = await window.web3Utils.isAddress(inputWithdrawalAddress);

      if (!isValidAddress) {
        setInputWithdrawalAddressFormatError(true);
        isError = true;
      } else {
        setInputWithdrawalAddressFormatError(false);
      }
    } else {
      setInputWithdrawalAddressStrengthError(true);
      isError = true;
      setInputWithdrawalAddressFormatError(false);
    }

    if (!isError) {
      // Set context
      setIndex(inputIndex);
      setNumberOfKeys(inputNumberOfKeys);
      setPassword(inputPassword);
      setWithdrawalAddress(inputWithdrawalAddress);

      const path = usingExistingFlow ? paths.CHOOSE_OPERATOR_EXISTING : paths.CHOOSE_OPERATOR;
      history.push(path);
    }
  };

  const validatePasswordOnInput = (password: string) => {
    if (password.length < 8) {
      setInputPasswordStrengthError(true);
    } else {
      setInputPasswordStrengthError(false);
    }
  };

  const handlePasswordInputOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validatePasswordOnInput(e.target.value);
  };
  
  const handleEth1WithdrawAddressInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    await validateWithdrawAddress(e.target.value);
  };

  const validateWithdrawAddress = async (address: string) => {
    if (address !== "") {
      const isValidAddress = await window.web3Utils.isAddress(address);

      if (!isValidAddress) {
        setInputWithdrawalAddressFormatError(true);
      } else {
        setInputWithdrawalAddressFormatError(false);
        setInputWithdrawalAddressStrengthError(false);
      }
    } else {
      setInputWithdrawalAddressStrengthError(true);
      setInputWithdrawalAddressFormatError(false);
    }
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      onNextClick();
    }
  };

  const onBackClick = () => {
    // Reset context
    setIndex(0);
    setNumberOfKeys(1);
    setWithdrawalAddress("");
    setPassword("");

    // Reset form
    setInputNumberOfKeys(1);
    setInputIndex(0);
    setInputWithdrawalAddress("");
    setInputPassword("");
    setPasswordToVerify("");
    history.goBack();
  };

  const onNextClick = () => {
    validateInputs();
  };

  return (
    <WizardWrapper
      actionBarItems={[
        <Button variant="text" color="info" onClick={onBackClick} tabIndex={3} startIcon={<KeyboardArrowLeft />}>Back</Button>,
        <Button variant="contained" color="primary" onClick={onNextClick} tabIndex={2}>Next</Button>,
      ]}
      activeTimelineIndex={1}
      timelineItems={usingExistingFlow ? ExistingMnemonicFlow : CreateMnemonicFlow}
      title="Create Keys"
    >
      <div className="tw-flex tw-flex-col tw-gap-4 tw-px-8">
        <div className="tw-mb-4 tw-text-lg">Nice! Your Secret Recovery Phrase is verified. Now let's collect some info about the keys to create:</div>

        <div className="tw-w-1/2 tw-flex tw-flex-row tw-pr-2">
          <Tooltip title={tooltips.NUMBER_OF_KEYS}>
            <TextField
              autoFocus
              className="tw-flex-1"
              id="number-of-keys"
              label="Number of Validators"
              variant="outlined"
              type="number"
              value={inputNumberOfKeys}
              onChange={updateNumberOfKeys}
              InputProps={{ inputProps: { min: 1, max: 1000 } }}
              error={inputNumberOfKeysError}
              helperText={ inputNumberOfKeysError ? errors.NUMBER_OF_KEYS : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ACACAC",
                  }
                },
              }}
            />
          </Tooltip>
        </div>

        <div className="tw-w-full tw-flex tw-flex-row tw-gap-4 tw-mt-4">
          <Tooltip title={tooltips.PASSWORD}>
            <TextField
              className="tw-flex-1"
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={inputPassword}
              onChange={updatePassword}
              onBlur={handlePasswordInputOnBlur}
              error={inputPasswordStrengthError}
              helperText={inputPasswordStrengthError ? errors.PASSWORD_STRENGTH : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" tabIndex={-1}>
                    <div tabIndex={-1} onClick={togglePasswordVisibility} role="button" style={{ outline: 'none'}}>
                      <IconButton edge="end" size="small" color="info" disableRipple tabIndex={-1}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </div>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ACACAC",
                  }
                },
              }}
            />
          </Tooltip>

          <Tooltip title={tooltips.PASSWORD}>
            <TextField
              className="tw-flex-1"
              id="password-to-verify"
              label="Retype Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={passwordToVerify}
              onChange={updatePasswordToVerify}
              onKeyDown={handleKeyDown}
              error={passwordVerifyError}
              helperText={passwordVerifyError ? errors.PASSWORD_MATCH : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" tabIndex={-1}>
                    <div tabIndex={-1} onClick={togglePasswordVisibility} role="button" style={{ outline: 'none'}}>
                      <IconButton edge="end" size="small" color="info" disableRipple tabIndex={-1}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </div>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ACACAC",
                  }
                },
              }}
            />
          </Tooltip>
        </div>

        <Typography className="tw-mt-6" variant="body1">
          Please ensure that you have control over this address.
        </Typography>
        <Tooltip title={tooltips.ETH1_WITHDRAW_ADDRESS}>
          <TextField
            className="tw-w-[440px]"
            id="eth1-withdraw-address"
            label="Ethereum Withdrawal Address"
            variant="outlined"
            value={inputWithdrawalAddress}
            onChange={updateEth1WithdrawAddress}
            onBlur={handleEth1WithdrawAddressInputBlur}
            onKeyDown={handleKeyDown}
            error={inputWithdrawalAddressFormatError || inputWithdrawalAddressStrengthError}
            helperText={
              inputWithdrawalAddressFormatError ? errors.ADDRESS_FORMAT_ERROR :
              inputWithdrawalAddressStrengthError ? errors.ADDRESS_STRENGTH : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ACACAC",
                }
              },
            }}
          />
        </Tooltip>
      </div>
    </WizardWrapper>
  );
};

export default ConfigureValidatorKeys;
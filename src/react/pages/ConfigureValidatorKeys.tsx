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
  const [verifyPassword, setVerifyPassword] = useState(false);
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
  }, []);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const updateEth1WithdrawAddress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim();
    setInputWithdrawalAddress(address);
  };

  const handleEth1WithdrawAddressInputBlur = async (e: any) => {
    await validateWithdrawAddress(e.target.value);
  }

  /**
   * Validates each value simultaneously and if there are no errors will show the
   * user the password verification input
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

    if (inputIndex < 0) {
      setInputIndexError(true);
      isError = true;
    } else {
      setInputIndexError(false);
    }

    if (inputWithdrawalAddress != "") {
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
      setVerifyPassword(true);
      setShowPassword(false);
    }
  };

  const validatePasswordOnInput = (password: any) => {
    if (password.length < 8) {
      setInputPasswordStrengthError(true);
    } else {
      setInputPasswordStrengthError(false);
    }
  }

  const handlePasswordInputOnBlur = (e: any) => {
    validatePasswordOnInput(e.target.value);
  }

  const validateWithdrawAddress = async (address: string) => {
    if (address != "") {
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

  /**
   * Verifies the passwords match and will move the user to the next step in the flow if so
   */
  const checkPassword = () => {
    if (inputPassword.localeCompare(passwordToVerify) == 0) {
      setPasswordVerifyError(false);
      
      // Set context
      setIndex(inputIndex);
      setNumberOfKeys(inputNumberOfKeys);
      setPassword(inputPassword);
      setWithdrawalAddress(inputWithdrawalAddress);

      history.push(paths.CHOOSE_OPERATOR);
    } else {
      setPasswordVerifyError(true);
    }
  };

  const onBackClick = () => {
    if (verifyPassword) {
      // Only reset password of configure form so the user can see index, number of keys, and address
      setPasswordToVerify("");
      setVerifyPassword(false);
      setPasswordVerifyError(false);
      setInputPassword("");

      setWithdrawalAddress("");
      setInputWithdrawalAddress("");
      setShowPassword(false);
    } else {
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
      history.goBack();
    }
  };

  const onNextClick = () => {
    if (verifyPassword) {
      checkPassword();
    } else {
      validateInputs();
    }
  };


  return (
    <WizardWrapper
      actionBarItems={[
        <Button variant="text" color="info" onClick={() => onBackClick()} tabIndex={3} startIcon={<KeyboardArrowLeft />}>Back</Button>,
        <Button variant="contained" color="primary" onClick={() => onNextClick()} tabIndex={2}>Next</Button>,
      ]}
      activeTimelineIndex={1}
      timelineItems={usingExistingFlow ? ExistingMnemonicFlow : CreateMnemonicFlow}
      title="Create Keys"
    >
      { verifyPassword ? (
        <div className="tw-flex tw-flex-col tw-gap-4 tw-ml-14">
          <div className="tw-text-lg">Just to be sure...</div>
          <TextField
            className="tw-mt-8 tw-w-[300px]"
            id="password"
            label="Retype Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            autoFocus
            onChange={(e) => setPasswordToVerify(e.target.value)}
            onKeyDown={handleKeyDown}
            error={passwordVerifyError}
            helperText={passwordVerifyError ? errors.PASSWORD_MATCH : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div onClick={togglePasswordVisibility} role="button" style={{ outline: 'none'}}>
                    <IconButton edge="end" size="small" color="info">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </div>
      ): (
        <div className="tw-flex tw-flex-col tw-gap-4 tw-px-8">
          <div className="tw-mb-4 tw-text-lg">Nice! Your Secret Recovery Phrase is verified. Now let's collect some info about the keys to create:</div>

          <div className="tw-w-full tw-flex tw-flex-row tw-gap-4">
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
              />
            </Tooltip>

            {usingExistingFlow && (
              <Tooltip title={tooltips.STARTING_INDEX}>
                <TextField
                  className="tw-flex-1"
                  id="index"
                  label="Amount of Existing (starting index)"
                  variant="outlined"
                  type="number"
                  value={inputIndex}
                  onChange={updateIndex}
                  InputProps={{ inputProps: { min: 1, max: 1000 } }}
                  error={inputIndexError}
                  helperText={inputIndexError ? errors.STARTING_INDEX : ""}
                />
            </Tooltip>
            )}

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
                    <InputAdornment position="end">
                      <div tabIndex={-1} onClick={togglePasswordVisibility} role="button" style={{ outline: 'none'}}>
                        <IconButton edge="end" size="small" color="info">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </div>
                    </InputAdornment>
                  ),
                }}
              />
            </Tooltip>
          </div>
          
          <Typography className="tw-mt-8" variant="body1">
            Please ensure that you have control over this address.
          </Typography>
          <Tooltip title={tooltips.ETH1_WITHDRAW_ADDRESS}>
            <TextField
              className="tw-mt-4 tw-w-[440px]"
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
            />
          </Tooltip>
          
        </div>
      )}
    </WizardWrapper>
  );
};

export default ConfigureValidatorKeys;
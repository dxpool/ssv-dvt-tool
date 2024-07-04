import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import { FC, ReactElement } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { paths } from "./constants";

// context wrappers
import BTECContextWrapper from "./BTECContext";
import GlobalContextWrapper from "./GlobalContext";
import KeyCreationContextWrapper from "./KeyCreationContext";
// components
import ConfigureValidatorKeys from "./pages/ConfigureValidatorKeys";
import ChooseOperators from "./pages/ChooseOperators";
import ConfigureWithdrawalAddress from "./pages/ConfigureWithdrawalAddress";
import CreateCredentialsChange from "./pages/CreateCredentialsChange";
import CreateMnemonic from "./pages/CreateMnemonic";
import CreateValidatorKeys from "./pages/CreateValidatorKeys";
import FinishCredentialsGeneration from "./pages/FinishCredentialsGeneration";
import FinishKeyGeneration from "./pages/FinishKeyGeneration";
import Home from "./pages/Home";
import MnemonicImport from "./pages/MnemonicImport";

import theme from "./theme";
// import VersionFooter from "./components/VersionFooter";

/**
 * Routing for the application. Broken into four sections:
 * - Primary home page
 * - Routes for creating a mnemonic and validator keys
 * - Routes for using an existing mnemonic to create validator keys
 * - Routes for generating the credentials change
 *
 * Each of the three flows is wrapped in a React Context that will store
 * the inputs of the user to be accessible across each page. This prevents
 * prop drilling
 */
const App: FC = (): ReactElement => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <GlobalContextWrapper>
            <div className="tw-flex tw-flex-col tw-h-full">
              <div className="tw-flex-grow">
                <main className="tw-flex tw-flex-col tw-h-full">
                  {/* <OnlineDetector /> */}
                  <Switch>
                    <Route exact path="/" render={() => <Home />} />

                    <Route>
                      {/* Create Mnemonic & Keys Flow */}
                      <KeyCreationContextWrapper>
                        <Switch>
                          <Route path={paths.CREATE_MNEMONIC} children={() => <CreateMnemonic />} />
                          <Route path={paths.CONFIGURE_CREATE} children={() => <ConfigureValidatorKeys />} />
                          <Route path={paths.CHOOSE_OPERATOR} children={() => <ChooseOperators />} />
                          <Route path={paths.CREATE_KEYS_CREATE} children={() => <CreateValidatorKeys />} />
                          <Route path={paths.FINISH_CREATE} children={() => <FinishKeyGeneration />} />
                        </Switch>
                      </KeyCreationContextWrapper>

                      {/* Import Mnemonic & Generate Keys Flow */}
                      <KeyCreationContextWrapper>
                        <Switch>
                          <Route path={paths.EXISTING_IMPORT} render={() => <MnemonicImport />} />
                          <Route path={paths.CONFIGURE_EXISTING} render={() => <ConfigureValidatorKeys />} />
                          <Route path={paths.CHOOSE_OPERATOR_EXISTING} render={() => <ChooseOperators />} />
                          <Route path={paths.CREATE_KEYS_EXISTING} render={() => <CreateValidatorKeys />} />
                          <Route path={paths.FINISH_EXISTING} render={() => <FinishKeyGeneration />} />
                        </Switch>
                      </KeyCreationContextWrapper>

                      {/* Update Withdrawal Credentials Flow */}
                      <BTECContextWrapper>
                        <Switch>
                          <Route path={paths.BTEC_IMPORT} render={() => <MnemonicImport />} />
                          <Route path={paths.CONFIGURE_BTEC} render={() => <ConfigureWithdrawalAddress />} />
                          <Route path={paths.CREATE_CREDENTIALS} render={() => <CreateCredentialsChange />} />
                          <Route path={paths.FINISH_CREDENTIALS} render={() => <FinishCredentialsGeneration />} />
                        </Switch>
                      </BTECContextWrapper>
                    </Route>
                  </Switch>
                </main>
              </div>
              <footer className="tw-p-4 tw-bg-gray-200">
                {/* <VersionFooter /> */}
              </footer>
            </div>
          </GlobalContextWrapper>
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
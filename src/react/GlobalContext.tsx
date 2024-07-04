import { Dispatch, SetStateAction, createContext, useState, useEffect } from "react";
import { Network } from "./types";
import { useHistory } from "react-router-dom";
import { EXPIRATION_CHECK_TIME } from "./constants";

import ExpireModal from "./modals/ExpireModal";

interface GlobalContextType {
  network: Network;
  setNetwork: Dispatch<SetStateAction<Network>>;
  operatorList: any;
  setOperatorList: Dispatch<SetStateAction<any>>;
  operatorMeta: OperatorMeta;
  setOperatorMeta: Dispatch<SetStateAction<OperatorMeta>>;
  nonce: number;
  setNonce: Dispatch<SetStateAction<number>>;
}

interface OperatorMeta {
  network: Network;
  expiration: number;
}

export const GlobalContext = createContext<GlobalContextType>({
  network: Network.MAINNET,
  setNetwork: () => {},
  operatorList: [],
  setOperatorList: () => {},
  operatorMeta: {network: Network.MAINNET, expiration: 0},
  setOperatorMeta: () => {},
  nonce: 0,
  setNonce: () => {},
});

/**
 * Global context for the params which is used across the application
 */
const GlobalContextWrapper = ({ children }: { children: React.ReactNode}) => {
  const history = useHistory();
  const [network, setNetwork] = useState<Network>(Network.MAINNET);
  const [operatorList, setOperatorList] = useState<any>([]);
  const [nonce, setNonce] = useState<number>(0);
  const [operatorMeta, setOperatorMeta] = useState<OperatorMeta>({ network: Network.MAINNET, expiration: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      if (operatorMeta.expiration !== 0 && operatorMeta.expiration <= Date.now()) {
        setIsExpired(true);
      }
    };

    checkExpiration();

    const interval = setInterval(checkExpiration, EXPIRATION_CHECK_TIME);

    return () => clearInterval(interval);
  }, [operatorMeta.expiration]);


  const goHome = () => {
    setIsExpired(false);
    setOperatorMeta({ network: Network.MAINNET, expiration: 0 });
    history.push("/");
  }

  return (
    <GlobalContext.Provider value={{ network, setNetwork, operatorList, setOperatorList, nonce, setNonce, operatorMeta, setOperatorMeta }}>
      {children}
      <ExpireModal onConfirm={goHome} open={isExpired} />
    </GlobalContext.Provider>
  );
};

export default GlobalContextWrapper;
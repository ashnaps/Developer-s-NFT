import { useEffect, useRef, useState } from "react";
import { walletconnect } from "web3modal/dist/providers/connectors";
import Web3Modal from "web3modal"

export default function Home() {
  const [walletconnected,setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const connectWallet = async() => {};

  useEffect (() => {
    if(!walletconnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  },[]);

 
  return <div></div>
    
  }

  
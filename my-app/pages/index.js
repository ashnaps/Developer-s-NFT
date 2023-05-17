import { useEffect, useRef, useState } from "react";
import { walletconnect } from "web3modal/dist/providers/connectors";
import Web3Modal from "web3modal"
import Head from "next/head";
import ethers from "ethers"

export default function Home() {
  const [walletConnected,setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async() => {
    await getProviderOrSigner();
    setWalletConnected(true);
  };

  const getProviderOrSigner = async(needSigner = false) {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.web3Provider(provider);
    
    const {chainId} = await web3Provider.getNetwork();
    if (chainId !==5 ) {
      window.alert("Please switch to the goerli");
      throw new Error("Incorrect network");
    }

    if (needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }

    //will ask user to connect the wallet, pop up

  }

  useEffect (() => {
    if(!walletconnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  },[]);

 
  return (
  <div>
    <head>
      <title>Crypto NFT</title>
    </head>
    <div className={styles.main}>
      {walletConnected ? ( <button onClick={connectWallet} className={styles.button}>Connect wallet</button>
) : null}
    </div>
  </div>
  );
  }

  
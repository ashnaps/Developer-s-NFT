import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import Head from "next/head";
import { ethers } from 'ethers';
import {providers} from "ethers";
import styles from "../styles/Home.module.css";
import Web3 from 'web3';



export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const connectWallet = async() => {
    await getProviderOrSigner();
    setWalletConnected(true);
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    //const web3Provider = new providers.Web3Provider(provider);
    //const web3Provider = new providers.Web3Provider(provider);
    const web3Provider = new ethers.BrowserProvider(window.ethereum);

    //const web3Provider = new ethers.providers.Web3Provider(web3.currentProvider);
    
    
    const { chainId } = await web3Provider.getNetwork();
    //const chainId = await web3.eth.net.getId();
    if (chainId !== 11155111) {
      window.alert("Please switch to the Sepolia");
      throw new Error("Incorrect network");
    }

    if (needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }

    //will ask user to connect the wallet, pop up
    // setWalletConnected(true);
    return web3Provider;
  };

  useEffect (() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "Sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  },[walletConnected]);


 
  return (
  <div>
    <Head>
      <title>Crypto NFT</title>
    </Head>
    <div className={styles.main}>
      {walletConnected ? ( <button onClick={connectWallet} className={styles.button}>Connect wallet</button>
) : null}
    </div>
  </div>
  );
  }

  
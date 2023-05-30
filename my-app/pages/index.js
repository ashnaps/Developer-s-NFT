import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import Head from "next/head";
import { ethers } from 'ethers';
import {providers,Contract} from "ethers";
import styles from "../styles/Home.module.css";
import Web3 from 'web3';
import {NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI} from "../constants";



export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [presaleStarted, setPreSaleStarted] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

//startPresale() must be accesible by owner only so, putting an another function
const getOwner = async() => {
  try{
    const signer=await getProviderOrSigner();
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS,NFT_CONTRACT_ABI, signer);
    const owner = nftContract.owner();
    const userAddress = signer.getAddress();
    if(owner.toLowerCase() === userAddress.toLowerCase()){
        setIsOwner(true);
    }
  }
  catch(error){
    console.log(error);
  }
}


const startPresale = async() => {
  try{
    const signer = await getProviderOrSigner(true);
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
    const txn = await nftContract.startPresale();
    await txn.wait();
    setPreSaleStarted(true);
  }
  catch(error){
    console.error(error)
  }
};

const chedkIfPresaleEnded = async () => {
  try{
  const provider=await getProviderOrSigner();
  const nftContract = new Contract(NFT_CONTRACT_ADDRESS,NFT_CONTRACT_ABI, provider);
  const presaleEndTime =await nftContract.presaleEnded();
  const currentTimeInSeconds = Date.now()/1000;
  const hasPresaleEnded = presaleEndTime.lt(Math.floor(currentTimeInSeconds));
  setPresaleEnded(hasPresaleEnded);
  }
  catch(error){
    console.error(error);
  }
}

const checkIfPresaleStarted = async() => {
  try{
    const provider=await getProviderOrSigner();
    //get instance of nft contract
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS,NFT_CONTRACT_ABI, provider);
    const isPresaleStarted = await nftContract.presaleStarted();
    setPresaleStarted(isPresaleStarted);
  }
  catch(error){
    console.error(error)
  }
};

  async function connectWallet() {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    }
    catch (error) {
      console.error(error);
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    //const web3Provider = new providers.Web3Provider(provider);
    const web3Provider = new ethers.BrowserProvider(window.ethereum);

    //const web3Provider = new ethers.providers.Web3Provider(web3.currentProvider);
    
    
    const { chainId } = await web3Provider.getNetwork();
    //const chainId = await web3.eth.net.getId();
    if (chainId !== 5) {
      window.alert("Please switch to the goerli");
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
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      checkIfPresaleStarted();
    }
  },[walletConnected]);


 
  return (
  <div>
    <Head>
      <title>Crypto NFT</title>
    </Head>
    <div className={styles.main}>
      {walletConnected ? null : ( <button onClick={connectWallet} className={styles.button}>Connect wallet</button>
)}
    </div>
  </div>
  );
  }

  
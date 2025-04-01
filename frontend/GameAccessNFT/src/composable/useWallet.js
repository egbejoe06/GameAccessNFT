import { ref } from "vue";
import { ethers } from "ethers";
import {
  AccessNFt_CONTRACT_ADDRESS,
  AccessNFt_CONTRACT_ABI,
} from "../constant/contracts";

// Network Configuration for Polygon
const Polygon_CHAIN_ID = 80002;
const Polygon_RPC_URL = "https://rpc-amoy.polygon.technology/";
const BLOCK_EXPLORER_URL = "https://www.oklink.com/amoy%E2%80%8D";

// Ethereum Objects
let provider = null;
let signer = null;

// Contract Instances
let ContractInstance = null;

// Reactive State
const connected = ref(false);
const userAccount = ref("");
const isAuthenticated = ref(false);

// Helper Functions
const initializeContracts = () => {
  ContractInstance = new ethers.Contract(
    AccessNFt_CONTRACT_ADDRESS,
    AccessNFt_CONTRACT_ABI,
    signer
  );
};

const resetConnection = () => {
  provider = null;
  signer = null;
  connected.value = false;
  userAccount.value = "";
  ContractInstance = null;
};

export const useWallet = () => {
  const handleChainChanged = (chainId) => {
    const decimalChainId = parseInt(chainId, 16);
    if (decimalChainId !== Polygon_CHAIN_ID) {
      resetConnection();
      window.location.reload();
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      resetConnection();
    } else {
      userAccount.value = accounts[0];
    }
  };

  const addPolygonNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${Polygon_CHAIN_ID.toString(16)}`,
            chainName: "Polygon Amoy Testnet",
            nativeCurrency: {
              name: "Polygon Amoy Testnet",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: [Polygon_RPC_URL],
            blockExplorerUrls: [BLOCK_EXPLORER_URL],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to add Polygon network:", error);
      throw error;
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Polygon_CHAIN_ID.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await addPolygonNetwork();
        await switchToPolygon(); // Retry after adding
      } else {
        throw error;
      }
    }
  };

  const initializeProvider = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    userAccount.value = await signer.getAddress();
    connected.value = true;
    initializeContracts();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // First ensure we're on Polygon network
        await switchToPolygon();

        // Then request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Initialize provider after network is correct and accounts are accessible
        await initializeProvider();

        return { connected: connected.value, account: userAccount.value };
      } catch (error) {
        resetConnection();
        console.error("Wallet connection failed:", error);
        throw error;
      }
    } else {
      const currentUrl = encodeURIComponent(window.location.href);
      const metamaskAppDeepLink = /iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? `metamask://dapp/${window.location.host}?redirect=${currentUrl}`
        : `https://metamask.app.link/dapp/${window.location.host}?redirect=${currentUrl}`;

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = metamaskAppDeepLink;
      } else {
        throw new Error("Please install MetaMask!");
      }
    }
  };

  const signInWithEthereum = async () => {
    if (!connected.value) throw new Error("Wallet not connected");

    const domain = window.location.host;
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const currentTime = new Date().toISOString();

    const message = `${domain} wants you to sign in with your Ethereum account:
${userAccount.value}

I accept the Terms of Service: https://${domain}/tos

URI: https://${domain}
Version: 1
Chain ID: ${Polygon_CHAIN_ID}
Nonce: ${nonce}
Issued At: ${currentTime}`;

    try {
      const signature = await signer.signMessage(message);
      isAuthenticated.value = true;
      return signature;
    } catch (error) {
      console.error("Sign-in failed:", error);
      throw error;
    }
  };

  return {
    connected,
    userAccount,
    isAuthenticated,
    connectWallet,
    signInWithEthereum,
    getContract: () => ContractInstance,
  };
};

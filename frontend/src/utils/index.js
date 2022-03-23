import SpotoCoin from "../artifacts/contracts/SpotoCoin.sol/SpotoCoin.json";
import LPT from "../artifacts/contracts/LPT.sol/LPT.json";
import SpotoRouter from "../artifacts/contracts/SpotoRouter.sol/SpotoRouter.json";
import LiquidityPool from "../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json";
import { BigNumber } from "ethers";
import { ethers } from "ethers";

export const contracts = {
  SPOTO_COIN: {
    abi: SpotoCoin.abi,
    address: "0x7748927847FFFf339764fAA81e6692a239F79261",
  },
  LIQUIDITY_POOL: {
    abi: LiquidityPool.abi,
    address: "0x3CAe819c23ebbf0EE0663B35777d7b2928034E5c",
  },
  LPT: {
    abi: LPT.abi,
    address: "0x5A2B6727A2AE7941B849998aB6Ef10bC69cBc876",
  },
  SPOTO_ROUTER: {
    abi: SpotoRouter.abi,
    address: "0x9d52F36A5C48Eea6399ea4D98b69865C90FcC6e5",
  },
};

export const requestAccount = async () => {
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return account;
};

const mapErrorToFriendlyMessage = (error) => {
  switch (error) {
    case "OWNER_ONLY":
      return "This is meant for the owner! What are you doing here?";
    case "FUNDS_MOVED_TO_LP":
      return "Funds have been already moved to the liquidity pool!";
    case "NO_AVAILABLE_TOKENS":
      return "Not enough SPT available!";
    case "CONTRACT_PAUSED":
      return "Contract is paused!";
    case "NOT_ALLOWED":
      return "You don't have permission to contribute!";
    case "User denied transaction":
      return "Transaction denied by user!";
    case "errorSignature=null":
      return "Error getting contract! Are you on the rinkeby network?";
    case "insufficient funds":
      return "Insufficient funds!";
    default:
      return "An error occured calling this method!";
  }
};

const getErrorFromReversion = (revertReason) => {
  console.log(revertReason);
  const revertErrors = [
    "NOT_ALLOWED",
    "OWNER_ONLY",
    "NO_AVAILABLE_TOKENS",
    "FUNDS_MOVED_TO_LP",
    "CONTRACT_PAUSED",
    "User denied transaction",
    "errorSignature=null",
    "insufficient funds",
  ];

  const error = revertErrors.find((errorConstant) =>
    revertReason.includes(errorConstant)
  );

  return mapErrorToFriendlyMessage(error);
};

export const handleContractCallError = (error) => {
  let errorReason = getErrorFromReversion(error?.message);

  return errorReason;
};

export const handleContractInteractionResponse = async (
  result,
  error,
  toast
) => {
  if (error) {
    return toast.error(error);
  }

  toast.success(
    "Transaction sent! Waiting for confirmation from the network..."
  );
  await result.wait();
  toast.success("Transaction confirmed!");
};

export const bigNumberToDecimal = (number) => {
  const decimals = BigNumber.from("10000000000000000"); //16 zeroes, the contract has 18 decimals so this would show 2
  const tokens = number.div(decimals).toString();
  return tokens / 100; //Divided by 100 so to move the comma two spaces left
};

export const callContractMethod = async (method) => {
  let error, result;
  try {
    result = await method();
  } catch (e) {
    error = handleContractCallError(e.error || e);
  }

  return {
    error,
    result,
  };
};

export const getContractInstance = async (
  contractToGet,
  withSigner = false
) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract, signer;

    if (withSigner) {
      await requestAccount();
      signer = getSigner(provider);
    }

    contract = new ethers.Contract(
      contracts[contractToGet].address,
      contracts[contractToGet].abi,
      signer || provider
    );

    return contract;
  }
};

export const getSigner = (provider) => {
  if (window.ethereum) {
    const signer = provider.getSigner();

    return signer;
  }
};
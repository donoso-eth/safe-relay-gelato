import { Contract, ethers } from "ethers";


import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });


import BuildInfo from "./BuidlNFT.json"
import StakingInfo from "./Staking.json"

import { CallWithERC2771Request, GelatoRelay } from "@gelatonetwork/relay-sdk";


const relayTransaction = async() => {

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_ID = process.env.ALCHEMY_KEY;
const RPC_URL = `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`


const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(
 process.env.PRIVATE_KEY,
  provider
);


const sponsorKey = process.env.SPONSOR_KEY || "";

if (!PRIVATE_KEY)
throw "⛔️ Private key not detected! Add it to the .env file!";

// Initialize the wallet.
const wallet = new ethers.Wallet(PRIVATE_KEY);

const nftContract = new Contract(BuildInfo.address,BuildInfo.abi, signer)




const { data } = await nftContract.populateTransaction.setApprovalForAll(
  StakingInfo.address,
  true
);


if (!data) throw new Error("Invalid transaction");

const request: CallWithERC2771Request = {
target: nftContract.address,
data: data,
chainId: 80001,
user: signer.address
};


const relay = new GelatoRelay();
const { taskId } = await relay.sponsoredCallERC2771(
request,
signer,
sponsorKey
);

console.log(
  `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${taskId}`
);
 
}
relayTransaction();

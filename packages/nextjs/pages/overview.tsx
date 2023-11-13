// import { useEffect, useState } from "react";
import type { NextPage } from "next";
// import { useLocalStorage } from "usehooks-ts";
import { useContractRead } from "wagmi";
// import { MetaHeader } from "~~/components/MetaHeader";
// import { ContractUI } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// import { ContractName } from "~~/utils/scaffold-eth/contract";
// import { getContractNames } from "~~/utils/scaffold-eth/contractNames";

const Overview: NextPage = () => {
  // const [yourCollectibles, setYourCollectibles] = useState();

  //   tokenOfOwnerByIndex;
  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: tokenURI } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    args: [BigInt(1)],
    functionName: "tokenURI",
  });

  // const getTokenURIByIndex = (index: any) => {
  //   const { data: tokenURI } = useContractRead({
  //     address: collectibles?.address,
  //     abi: collectibles?.abi,
  //     args: [BigInt(index)],
  //     functionName: "tokenURI",
  //   });

  //   return tokenURI;
  // };

  // const updateCollectibles = () => {
  //   const jsonManifestString = atob(tokenURI.substring(29));
  //   const jsonManifest = JSON.parse(jsonManifestString);
  // };

  //   const { data: dataSubmitTransaction, write: submitTransaction } = useContractWrite({
  //     address: multiSigWalletAddress.multiSigWalletAddress,
  //     abi: multiSigWallet?.abi,
  //     functionName: "submitTransaction",
  //   });

  //   const {
  //     writeAsync: createContract,
  //     isLoading: isLoadingCreateContract,
  //     // isSuccess: isSuccessCreateContract,
  //   } = useScaffoldContractWrite({
  //     contractName: "MultiSigFactory",
  //     functionName: "createContract",
  //     args: [BigInt(confirmations), signers],
  //     blockConfirmations: 1,
  //     onBlockConfirmation: txnReceipt => {
  //       console.log("Transaction blockHash", txnReceipt.blockHash);
  //     },
  //   });

  return (
    <>
      <h1>Overview</h1>
      <button onClick={() => console.log(tokenURI)}> Click me</button>
      {/* <img
        src={
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBpZD0iZXllMSI+PGVsbGlwc2Ugc3Ryb2tlLXdpZHRoPSIzIiByeT0iMjkuNSIgcng9IjI5LjUiIGlkPSJzdmdfMSIgY3k9IjE1NC41IiBjeD0iMTgxLjUiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI2ZmZiIvPjxlbGxpcHNlIHJ5PSIzLjUiIHJ4PSIyLjUiIGlkPSJzdmdfMyIgY3k9IjE1NC41IiBjeD0iMTczLjUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+PC9nPjxnIGlkPSJoZWFkIj48ZWxsaXBzZSBmaWxsPSIjYzE2MjUxIiBzdHJva2Utd2lkdGg9IjMiIGN4PSIyMDQuNSIgY3k9IjIxMS44MDA2NSIgaWQ9InN2Z181IiByeD0iODkiIHJ5PSI1MS44MDA2NSIgc3Ryb2tlPSIjMDAwIi8+PC9nPjxnIGlkPSJleWUyIj48ZWxsaXBzZSBzdHJva2Utd2lkdGg9IjMiIHJ5PSIyOS41IiByeD0iMjkuNSIgaWQ9InN2Z18yIiBjeT0iMTY4LjUiIGN4PSIyMDkuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjZmZmIi8+PGVsbGlwc2Ugcnk9IjMuNSIgcng9IjMiIGlkPSJzdmdfNCIgY3k9IjE2OS41IiBjeD0iMjA4IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIvPjwvZz48L3N2Zz4="
        }
        alt="asdas"
      /> */}
    </>
  );
};

export default Overview;

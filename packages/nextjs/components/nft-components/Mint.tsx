import { useEffect } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

export const Mint = () => {
  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });
  const { setMinted } = useSharedState();

  const { data: dataMintNFT, write: mintNFT } = useContractWrite({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "mintItem",
  });

  const { isSuccess: isSuccessMintNFT } = useWaitForTransaction({
    hash: dataMintNFT?.hash,
  });

  useEffect(() => {
    if (isSuccessMintNFT) {
      setMinted(true);
    }
  }, [isSuccessMintNFT, setMinted]);

  return (
    <>
      <button className={"btn btn-accent w-1/4"} onClick={() => mintNFT()}>
        {" "}
        Mint Your Bumbly Bear
      </button>
    </>
  );
};

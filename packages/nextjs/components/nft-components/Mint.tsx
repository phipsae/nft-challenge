import { useEffect } from "react";
import { Spinner } from "../assets/Spinner";
import { formatEther } from "viem";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";
import { notification } from "~~/utils/scaffold-eth";

export const Mint = () => {
  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });
  const { setMinted } = useSharedState();

  const { data: NFTPrice } = useScaffoldContractRead({
    contractName: "YourCollectible",
    functionName: "NFTPrice",
    watch: true,
    cacheOnBlock: true,
  });

  const { data: maxSupply } = useScaffoldContractRead({
    contractName: "YourCollectible",
    functionName: "maxSupply",
    watch: true,
    cacheOnBlock: true,
  });

  const { data: totalSupply } = useScaffoldContractRead({
    contractName: "YourCollectible",
    functionName: "totalSupply",
    watch: true,
    cacheOnBlock: true,
  });

  function conversion() {
    if (NFTPrice === undefined) return;
    return formatEther(NFTPrice);
  }

  const { data: dataMintNFT, write: mintNFT } = useContractWrite({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "mintItem",
    value: BigInt(NFTPrice || 0),
  });

  const { isSuccess: isSuccessMintNFT, isLoading: isLoadingMintNFT } = useWaitForTransaction({
    hash: dataMintNFT?.hash,
  });

  useEffect(() => {
    if (isSuccessMintNFT) {
      setMinted(true);
      notification.success("NFT successfully minted");
    }
  }, [isSuccessMintNFT, setMinted]);

  return (
    <>
      <div className="flex flex-col">
        <button className={"btn btn-error w-full"} onClick={() => mintNFT()}>
          {isLoadingMintNFT ? (
            <div className="flex w-[100px] justify-center">
              <Spinner width="100" height="100"></Spinner>
            </div>
          ) : (
            `Mint Your Bumbly Bear for ${conversion()} ETH`
          )}
        </button>
        <div className="flex justify-center mt-1">
          <h2> each time someone mints the price goes up by 0.0001 ether</h2>
        </div>
        <div className="flex justify-center mt-1">
          <h2>
            {" "}
            {Number(totalSupply)}/{Number(maxSupply)} Mint Limit{" "}
          </h2>
        </div>
      </div>
    </>
  );
};

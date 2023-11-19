import { useEffect } from "react";
import { NFTCard } from "./NFTCard";
import { useContractRead } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

export const AllNFTs = () => {
  const { minted, setMinted, updateTrigger, setUpdateTrigger } = useSharedState();

  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: totalSupply, refetch: refetchTotalSupply } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "totalSupply",
  });

  const nftIDs = () => {
    const array = [...Array(Number(totalSupply))].map((_, index) => index + 1);
    console.log(array);
    return array;
  };

  useEffect(() => {
    if (minted) {
      setMinted(false);
      refetchTotalSupply();
    }
    if (updateTrigger) {
      setUpdateTrigger(false);
      refetchTotalSupply();
      console.log("I am here, allNFTs");
    }
  }, [minted, setMinted, refetchTotalSupply, updateTrigger, setUpdateTrigger]);

  return (
    <>
      {(totalSupply || 0) > 0 ? (
        <div className="grid grid-cols-3 gap-2 overflow-auto" style={{ height: `${3 * 160}px` }}>
          {nftIDs().map((item, index) => (
            <div key={index} className="p-2 rounded ">
              <NFTCard tokenId={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[480px]">
          <p className="font-bold"> {"No NFTS yet"}</p>
        </div>
      )}
    </>
  );
};

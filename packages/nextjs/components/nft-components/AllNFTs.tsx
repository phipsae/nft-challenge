import { useEffect } from "react";
import { NFTCard } from "./NFTCard";
import { useContractRead } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

export const AllNFTs = () => {
  const { minted, setMinted } = useSharedState();

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
  }, [minted, setMinted, refetchTotalSupply]);

  return (
    <>
      {(totalSupply || 0) > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {nftIDs().map((item, index) => (
            <div key={index} className="p-2 rounded ">
              <NFTCard tokenId={item} />
            </div>
          ))}
        </div>
      ) : (
        <p> {"No NFTS yet"}</p>
      )}
    </>
  );
};

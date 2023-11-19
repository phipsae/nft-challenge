import { NFTCard } from "./NFTCard";
import { useAccount } from "wagmi";
import { useSharedState } from "~~/sharedStateContext";

export const YourNFTs = () => {
  const { address } = useAccount();

  const { ownerTokenPairs } = useSharedState();

  const yourNftIds = () => {
    const filteredPairs = ownerTokenPairs.filter(pair => pair.owner === address);
    return filteredPairs.map(pair => pair.tokenId);
  };

  return (
    <>
      {yourNftIds().length > 0 ? (
        <div className="grid grid-cols-3 gap-2 overflow-auto" style={{ height: `${3 * 160}px` }}>
          {yourNftIds().map((item, index) => (
            <div key={index} className="p-2 rounded ">
              <NFTCard tokenId={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[480px]">
          <p className="font-bold">No NFTs yet</p>
        </div>
      )}
    </>
  );
};

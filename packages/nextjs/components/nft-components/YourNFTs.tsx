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
        <div className="grid grid-cols-3 gap-2">
          {yourNftIds().map((item, index) => (
            <div key={index} className="p-2 rounded ">
              <NFTCard tokenId={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-3 p-2 rounded flex justify-center items-center">
          <p>No NFTs yet</p>
        </div>
      )}
    </>
  );
};

// const getYourNFTs = useCallback(async () => {
//   const yourUris: any = [];
//   const numberOfMyNFTsSafe = Number(numberOfMyNFTs) || 0;
//   if (numberOfMyNFTsSafe > 0) {
//     for (let index = 0; index < numberOfMyNFTsSafe; index++) {
//       const tokenIndex = await client.readContract({
//         address: collectibles?.address || "",
//         abi: collectibles?.abi as Abi,
//         functionName: "tokenOfOwnerByIndex",
//         args: [address, BigInt(index)],
//       });
//       const tokenIndexSafe = Number(tokenIndex) || 0;
//       // const uri = await client.readContract({
//       //   address: collectibles?.address || "",
//       //   abi: collectibles?.abi as Abi,
//       //   functionName: "tokenURI",
//       //   args: [BigInt(tokenIndexSafe)],
//       // });
//       // const uriSubstring = String(uri).substring(29);
//       // const decodedString = Buffer.from(uriSubstring as string, "base64").toString();
//       // const jsonItem = JSON.parse(decodedString);
//       // yourUris.push(jsonItem);
//     }
//     setYourNFTs(yourUris);
//   }
// }, [address, client, collectibles?.abi, collectibles?.address, numberOfMyNFTs]);

// useEffect(() => {
//   const fetchData = async () => {
//     const numberOfMyNFTsSafe = Number(numberOfMyNFTs) || 0;
//     if (numberOfMyNFTsSafe > 0) {
//       await getYourNFTs();
//     }
//   };
//   fetchData();
// }, [totalSupply, numberOfMyNFTs, getYourNFTs]);

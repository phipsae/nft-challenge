import { useCallback, useEffect, useState } from "react";
import { Buffer } from "buffer";
import { useContractRead } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

interface NFTCardProps {
  tokenId: number;
}

interface OwnerTokenPair {
  owner: string;
  tokenId: number;
}

export const NFTCard = ({ tokenId }: NFTCardProps) => {
  const [name, setName] = useState("...loading");
  const [description, setDescription] = useState("...loading");
  const [image, setImage] = useState("...loading");
  const [owner, setOwner] = useState("...loading");

  // for your NFTs
  const { ownerTokenPairs, setOwnerTokenPairs } = useSharedState();

  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: tokenURI, isLoading: isLoadingTokenURI } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  const { data: ownerNft } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
    onSuccess(data) {
      console.log("Success", data);
      setOwner(data);
      const isTokenIdAlreadyPresent = ownerTokenPairs.some(pair => pair.tokenId === tokenId);
      if (!isTokenIdAlreadyPresent) {
        setOwnerTokenPairs((currentPairs: OwnerTokenPair[]) => [...currentPairs, { owner: data, tokenId }]);
      }
    },
  });

  const JSONURI = useCallback(async (tokenURI: any) => {
    const testURI = await tokenURI;
    console.log(testURI);
    try {
      const uriSubstring = String(testURI.substring(29));
      const decodedString = Buffer.from(uriSubstring as string, "base64").toString();
      const JSONURI = JSON.parse(decodedString);
      setName(JSONURI.name);
      setDescription(JSONURI.description);
      setImage(JSONURI.image);
    } catch {
      setInterval(() => {
        JSONURI;
      }, 200);
    }
  }, []);

  useEffect(() => {
    JSONURI(tokenURI);
    console.log(ownerNft);
    console.log(owner);
  }, [tokenURI, JSONURI, ownerNft, owner]);

  return (
    <>
      <div className="card card-compact w-52 bg-base-100 shadow-xl">
        {isLoadingTokenURI ? (
          "is loading..."
        ) : (
          <figure style={{ width: "100%", height: "150px", overflow: "hidden" }}>
            <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </figure>
        )}

        <div className="card-body">
          <div className="flex flex-row justify-between">
            <h2 className="card-title">{name}</h2>
            {/* {all && (
              <div className="card-actions justify-end">
                <button className="btn btn-error">Fight</button>
              </div>
            )} */}
          </div>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

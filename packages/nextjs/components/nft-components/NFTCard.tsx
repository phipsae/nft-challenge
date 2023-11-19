import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { TransferModal } from "./TransferModal";
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
  const { ownerTokenPairs, setOwnerTokenPairs, updateTrigger, setUpdateTrigger } = useSharedState();

  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: tokenURI, isLoading: isLoadingTokenURI } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  const { data: ownerNft, refetch: refetchOwnerNft } = useContractRead({
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
    if (updateTrigger) {
      console.log("I am here, NFTCard!!!!!!");
      console.log("before", ownerTokenPairs);
      refetchOwnerNft();
      console.log("after", ownerTokenPairs);
      setUpdateTrigger(false);
    }
  }, [tokenURI, JSONURI, ownerNft, owner, updateTrigger, setUpdateTrigger, ownerTokenPairs, refetchOwnerNft]);

  // Modal
  const element = document.getElementById(name);

  return (
    <>
      <div
        className="card card-compact w-52 bg-base-100 shadow-xl"
        onClick={() => {
          if (element) {
            (element as HTMLDialogElement).showModal();
          }
        }}
      >
        {isLoadingTokenURI
          ? "is loading..."
          : image != "...loading" && (
              <div className="rounded-t-lg overflow-hidden">
                <figure style={{ width: "100%", height: "150px", overflow: "hidden" }}>
                  <Image
                    src={image}
                    alt={name}
                    width={100}
                    height={100}
                    layout="responsive"
                    className="rounded-t-lg object-cover"
                  />
                </figure>
              </div>
            )}

        <div className="card-body">
          <div className="flex flex-row justify-between">
            <h2 className="card-title">{name}</h2>
          </div>
          <p>{description}</p>
        </div>
      </div>
      <TransferModal name={name} description={description} image={image} tokenId={tokenId} owner={owner} />
    </>
  );
};

import { useCallback, useEffect } from "react";
import { NFTCard } from "./NFTCard";
import { Buffer } from "buffer";
import { Abi, createPublicClient, http } from "viem";
import { useContractRead } from "wagmi";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const YourNFTs = () => {
  const { yourNFTs, setYourNFTs } = useSharedState();

  const { address } = useAccount();

  const client = createPublicClient({
    chain: getTargetNetwork(),
    transport: http(),
  });

  const { data: collectibles } = useScaffoldContract({
    contractName: "YourCollectible",
  });

  const { data: totalSupply } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "totalSupply",
  });

  const { data: numberOfMyNFTs } = useContractRead({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "balanceOf",
    args: [address || ""],
  });

  const getYourNFTs = useCallback(async () => {
    const yourUris: any = [];
    const numberOfMyNFTsSafe = Number(numberOfMyNFTs) || 0;
    if (numberOfMyNFTsSafe > 0) {
      for (let index = 0; index < numberOfMyNFTsSafe; index++) {
        const tokenIndex = await client.readContract({
          address: collectibles?.address || "",
          abi: collectibles?.abi as Abi,
          functionName: "tokenOfOwnerByIndex",
          args: [address, BigInt(index)],
        });
        const tokenIndexSafe = Number(tokenIndex) || 0;
        const uri = await client.readContract({
          address: collectibles?.address || "",
          abi: collectibles?.abi as Abi,
          functionName: "tokenURI",
          args: [BigInt(tokenIndexSafe)],
        });
        const uriSubstring = String(uri).substring(29);
        const decodedString = Buffer.from(uriSubstring as string, "base64").toString();
        const jsonItem = JSON.parse(decodedString);
        yourUris.push(jsonItem);
      }
      setYourNFTs(yourUris);
    }
  }, [address, client, collectibles?.abi, collectibles?.address, numberOfMyNFTs]);

  useEffect(() => {
    const fetchData = async () => {
      const numberOfMyNFTsSafe = Number(numberOfMyNFTs) || 0;
      if (numberOfMyNFTsSafe > 0) {
        await getYourNFTs();
      }
    };
    fetchData();
  }, [totalSupply, numberOfMyNFTs, getYourNFTs]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {yourNFTs.map((item, index) => (
          <div key={index} className="p-2 rounded ">
            <NFTCard src={item.image} name={item.name} description={item.description} all={false} />
          </div>
        ))}
      </div>
    </>
  );
};

import { useCallback, useEffect } from "react";
import { NFTCard } from "./NFTCard";
import { Buffer } from "buffer";
import { Abi, createPublicClient, http } from "viem";
import { useContractRead } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const AllNFTs = () => {
  const { allNFTs, setAllNFTs } = useSharedState();
  const { minted, setMinted } = useSharedState();

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

  const getAllNFTs = useCallback(async () => {
    const uris: any = [];
    const counters = totalSupply || 0;
    for (let counter = 1; counter <= counters; counter++) {
      try {
        const uri = await client.readContract({
          address: collectibles?.address || "",
          abi: collectibles?.abi as Abi,
          functionName: "tokenURI",
          args: [BigInt(counter)],
        });
        const uriSubstring = String(uri).substring(29);
        const decodedString = Buffer.from(uriSubstring as string, "base64").toString();
        const jsonItem = JSON.parse(decodedString);
        uris.push(jsonItem);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setAllNFTs(uris);
  }, [client, collectibles?.abi, collectibles?.address, totalSupply]);

  useEffect(() => {
    const fetchData = async () => {
      const totalSupplySafe = Number(totalSupply) || 0;
      if (totalSupplySafe > 0) {
        await getAllNFTs();
      }
    };
    fetchData();
  }, [getAllNFTs, totalSupply]);

  useEffect(() => {
    if (minted) {
      console.log("Minted from AllNFTs");
      getAllNFTs().then(() => setMinted(false)); // Refresh and then reset the minted state
    }
  }, [minted, getAllNFTs, setMinted]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {allNFTs.map((item, index) => (
          <div key={index} className="p-2 rounded ">
            <NFTCard src={item.image} name={item.name} description={item.description} all={true} />
          </div>
        ))}
      </div>
    </>
  );
};

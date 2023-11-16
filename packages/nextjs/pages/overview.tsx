import { useEffect, useState } from "react";
import Image from "next/image";
import { Buffer } from "buffer";
import type { NextPage } from "next";
import { Abi, createPublicClient, http } from "viem";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

interface Collectible {
  name: string;
  description: string;
  image: string;
}

const Overview: NextPage = () => {
  const [allNFTs, setAllNFTs] = useState<Collectible[]>([]);
  const [yourNFTs, setYourNFTs] = useState<Collectible[]>([]);

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

  // mint NFTs
  const { data: dataMintNFT, write: mintNFT } = useContractWrite({
    address: collectibles?.address,
    abi: collectibles?.abi,
    functionName: "mintItem",
  });

  const { isSuccess: isSuccessMintNFT } = useWaitForTransaction({
    hash: dataMintNFT?.hash,
  });

  const getYourNFTs = async () => {
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
  };

  const getAllNFTs = async () => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const totalSupplySafe = Number(totalSupply) || 0;
      if (totalSupplySafe > 0) {
        await getAllNFTs();
      }
      const numberOfMyNFTsSafe = Number(numberOfMyNFTs) || 0;
      if (numberOfMyNFTsSafe > 0) {
        await getYourNFTs();
      }
    };
    fetchData();
    if (isSuccessMintNFT) {
      console.log("minted");
      fetchData();
    }
  }, [totalSupply, numberOfMyNFTs, isSuccessMintNFT]);

  return (
    <>
      <h1>Overview</h1>
      <button onClick={() => mintNFT()}> Mint NFT</button>
      <button onClick={() => console.log(yourNFTs)}> Click me</button>
      <button onClick={() => console.log(totalSupply)}> Total Supply</button>
      <h1>NFTS</h1>
      {allNFTs.map((item, index) => (
        <div key={index}>
          <Image src={item.image} alt={`Collectible ${index}`} width={200} height={200} />
          <p>{item.name}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </>
  );
};

export default Overview;

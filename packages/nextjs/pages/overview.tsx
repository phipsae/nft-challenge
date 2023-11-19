import type { NextPage } from "next";
import { AllNFTs } from "~~/components/nft-components/AllNFTs";
import { Mint } from "~~/components/nft-components/Mint";
import { YourNFTs } from "~~/components/nft-components/YourNFTs";

const Overview: NextPage = () => {
  return (
    <>
      <div className="text-center ">
        <span className="block text-2xl font-bold">Bumbly Bear Brigade</span>
      </div>
      <div className="flex justify-center mt-5">
        <Mint />
      </div>
      <div className="flex flex-row gap-5 mt-5 justify-center">
        <div className="flex flex-col col-1 border p-5">
          <div className="text-center mb-5">
            <span className="block text-2xl font-bold">All Bears</span>
          </div>
          <AllNFTs />
        </div>
        <div className="flex flex-col col-1 border p-5">
          <div className="text-center mb-5">
            <span className="block text-2xl font-bold">Your Bears</span>
          </div>
          <YourNFTs />
        </div>
      </div>
    </>
  );
};

export default Overview;

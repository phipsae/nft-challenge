import { useState } from "react";
import { Spinner } from "../assets/Spinner";
import { AddressInput } from "../scaffold-eth";
import { useAccount } from "wagmi";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

interface TransferModalProps {
  name: string;
  description: string;
  image: string;
  tokenId: any;
  owner: string;
}

export const TransferModal = ({ name, description, image, tokenId, owner }: TransferModalProps) => {
  const [to, setTo] = useState("");
  const { address } = useAccount();
  const { setUpdateTrigger } = useSharedState();

  const { writeAsync: transferNft, isLoading: isLoadingTransferNft } = useScaffoldContractWrite({
    contractName: "YourCollectible",
    functionName: "transferFrom",
    args: [address, to, BigInt(tokenId)],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
      setUpdateTrigger(true);
    },
  });

  return (
    <>
      <dialog id={name} className="modal">
        <div className="modal-box">
          <div className="flex flex-row justify-between gap-5">
            <div className="flex flex-1">
              <div className="card card-compact w-52 bg-base-100 shadow-xl flex col-1">
                <div className="rounded-t-lg overflow-hidden">
                  <figure style={{ width: "100%", height: "150px", overflow: "hidden" }}>
                    <img
                      src={image}
                      alt={name}
                      style={{ width: "100%", height: "100%" }}
                      className="rounded-t-lg object-cover"
                    />
                  </figure>
                </div>
                <div className="card-body">
                  <div className="flex flex-row justify-between">
                    <h2 className="card-title">{name}</h2>
                  </div>
                  <p>{description}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-center">
                <span className="w-full mb-5 text-center font-bold"> Transfer NFT to another person</span>
              </div>
              {owner === address ? (
                <div className="flex flex-1 gap-5 items-end">
                  <div className="flex flex-col">
                    <span className="w-full mb-5">
                      <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
                    </span>
                    {isLoadingTransferNft ? (
                      <div className="flex w-[100px] justify-center">
                        <Spinner width="100" height="100"></Spinner>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto"
                        onClick={() => {
                          transferNft();
                        }}
                      >
                        Transfer NFT
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="font-bold">Not the owner</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

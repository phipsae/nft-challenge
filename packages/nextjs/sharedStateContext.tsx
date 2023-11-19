import { ReactNode, createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  minted: boolean;
  setMinted: (value: boolean) => void;
  allNFTs: Collectible[];
  setAllNFTs: (value: Collectible[]) => void;
  yourNFTs: Collectible[];
  setYourNFTs: (value: Collectible[]) => void;
  ownerTokenPairs: OwnerTokenPair[];
  setOwnerTokenPairs: React.Dispatch<React.SetStateAction<OwnerTokenPair[]>>;
  updateTrigger: boolean;
  setUpdateTrigger: (value: boolean) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [minted, setMinted] = useState<boolean>(false);
  const [allNFTs, setAllNFTs] = useState<Collectible[]>([]);
  const [yourNFTs, setYourNFTs] = useState<Collectible[]>([]);
  const [ownerTokenPairs, setOwnerTokenPairs] = useState<OwnerTokenPair[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);

  return (
    <SharedStateContext.Provider
      value={{
        minted,
        setMinted,
        allNFTs,
        setAllNFTs,
        yourNFTs,
        setYourNFTs,
        ownerTokenPairs,
        setOwnerTokenPairs,
        updateTrigger,
        setUpdateTrigger,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};

interface Collectible {
  name: string;
  description: string;
  image: string;
}

interface OwnerTokenPair {
  owner: string;
  tokenId: number;
}

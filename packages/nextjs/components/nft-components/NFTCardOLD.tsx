interface NFTCardProps {
  src: string;
  name: string;
  description: string;
  all: boolean;
}

export const NFTCardOLD = ({ src, name, description, all }: NFTCardProps) => {
  return (
    <>
      <div className="card card-compact w-52 bg-base-100 shadow-xl">
        <figure style={{ width: "100%", height: "150px", overflow: "hidden" }}>
          <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </figure>
        <div className="card-body">
          <div className="flex flex-row justify-between">
            <h2 className="card-title">{name}</h2>
            {all && (
              <div className="card-actions justify-end">
                <button className="btn btn-error">Fight</button>
              </div>
            )}
          </div>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

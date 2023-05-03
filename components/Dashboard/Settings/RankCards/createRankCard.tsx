import { ExclamationTriangleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { cropResizeGif } from "gif-cropper-resizer-browser";
import { GifCodec, GifFrame, GifUtil } from "gifwrap";
import decodeGif from "decode-gif";
import Jimp from "jimp";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { fetcher } from "../../../../utils/discordFetcher";
import { getGuildShardURL } from "../../../../utils/ShardLib";
import {
  CardRarity,
  rarityGradientMap,
  rarityWordMap,
} from "../../../../utils/types";
import SelectMenu from "../../../Misc/SelectMenu";
import { Modal } from "../../../Modal";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  }) as Promise<string | ArrayBuffer | null>;
export const CreateRankCard = (props: {
  onUpdate: () => void;
  guild: string;
}) => {
  const { guild } = props;
  const [editMode, setEditMode] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [rarity, setRarity] = useState(CardRarity.COMMON);
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [fileHover, setFileHover] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState(null as string | null);
  const [processingProgress, setProcessingProgress] = useState("" as string);
  useEffect(() => {
    if (!file) {
      setFileURL(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileURL(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const [croppedFile, setCroppedFile] = useState(null as string | null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const cropArea = useRef({ x: 0, y: 0, width: 0, height: 0 } as Area);
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log({ croppedArea, croppedAreaPixels });
      cropArea.current = croppedAreaPixels;
    },
    []
  );
  useEffect(() => {
    setError("");
  }, [cardName, cardDescription, rarity, croppedFile, file]);

  const inputRef = useRef<HTMLInputElement>(null);
  //   useEffect(() => {
  //     setCardName(card.name);
  //     setCardDescription(card.description);
  //     setRarity(card.rarity);
  //   }, [card, editMode]);
  return (
    <>
      {/* only accept, png, jpeg, gif */}
      <input
        type="file"
        accept="image/png, image/jpeg, image/gif"
        onInput={(e) => {
          if (
            !["image/png", "image/jpeg", "image/gif"].includes(
              (e.target as any).files[0].type
            )
          ) {
            setError("Please upload a valid image file");
            return;
          }
          if ((e.target as any).files[0].size > 1024 * 1024 * 12) {
            setError("Please upload an image less than 12MB");
            return;
          }
          setFile((e.target as any).files[0]);
          // clear the input so that the same file can be uploaded again
          (e.target as any).value = null;
        }}
        ref={inputRef}
        hidden
      />
      <div
        className={`flex flex-col gap-6 border mt-6 p-8 rounded-3xl border-gray-100/10 bg-gray-800 shadow-md ${
          updating && `opacity-50 animate-pulse pointer-events-none`
        } transition-all`}
      >
        <div className={`flex flex-row justify-between items-start z-20`}>
          <h1 className={`text-2xl font-bold font-poppins w-full`}>
            Add a new rank card
          </h1>
          {/* <span
        className={`text-2xl font-wsans font-bold uppercase bg-gradient-to-r ${
          rarityGradientMap[card.rarity]
        } animate-gradient-medium leading-loose bg-clip-text text-transparent `}
      >
        {rarityWordMap[card.rarity]}
      </span> */}
        </div>
        {error && (
          <div
            className={`flex flex-row gap-4 bg-red-900/30 p-4 rounded-3xl items-center`}
          >
            <ExclamationTriangleIcon className={`h-6 w-6 text-red-400`} />
            <span className={`text-red-400`}>{error}</span>
          </div>
        )}

        <div className={`flex flex-row gap-4`}>
          <div className={`flex flex-col gap-2 relative w-full`}>
            <span className={`text-gray-300 font-wsans font-medium`}>
              Card Name
            </span>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.substring(0, 40))}
              className={`text-3xl bg-gray-850 px-4 p-2 rounded-2xl font-medium font-poppins focus:outline-none focus:ring-2 ring-0 ring-indigo-500 transition-all`}
            />
            <span
              className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
            >
              {cardName.length}/40
            </span>
          </div>
          <div
            className={`flex flex-col gap-2 items-start font-wsans font-medium z-20 w-64`}
          >
            <SelectMenu
              label="Rarity"
              selectItems={Object.values(CardRarity).map((x) => ({
                id: x,
                name: rarityWordMap[x],
              }))}
              selectedItemId={rarity}
              onSelect={(x) => setRarity(x.id as CardRarity)}
              className={`w-full`}
            />
          </div>
        </div>

        <div className={`flex flex-col justify-center items-center`}>
          <div
            className={`card rounded-3xl shadow-lg w-full p-1.5 relative overflow-hidden shrink-0 z-10`}
          >
            <div
              className={`w-full object-cover z-10 rounded-3xl relative aspect-[1024/340] bg-gray-900/50`}
            >
              {croppedFile && (
                <div className={`w-full h-full relative`}>
                  <img src={croppedFile} className={`rounded-2xl`} />
                </div>
              )}
              <div
                className={`flex flex-col gap-4 items-center w-full h-full rounded-2xl ${`${
                  croppedFile
                    ? `${
                        fileHover ? `opacity-100` : `opacity-0`
                      } hover:opacity-100 bg-gray-900/80`
                    : `${
                        fileHover ? `bg-gray-900/50` : `bg-gray-900/0`
                      } hover:bg-gray-900/0 `
                }`} justify-center transition-all cursor-pointer text-gray-400 hover:text-gray-50 absolute z-10 top-0 left-0`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  console.log("dragging", e);
                  setFileHover(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setFileHover(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  console.log("dropped", e);
                  setFileHover(false);
                  const files = e.dataTransfer.files;
                  const filesToAdd = Array.from(files);
                  //   check if file is valid
                  if (filesToAdd.length > 1 || !filesToAdd[0]) return;
                  // check if filetype is valid
                  if (
                    ![
                      "image/png",
                      "image/jpeg",
                      "image/gif",
                      "image/jpg",
                    ].includes(filesToAdd[0].type)
                  ) {
                    setError("Invalid file type");
                    return;
                  }
                  if (filesToAdd[0].size > 12 * 1024 * 1024) {
                    setError(`File size too large ${filesToAdd[0].size}MB`);
                    return;
                  }
                  setError("");
                  setFile(filesToAdd[0]);
                }}
              >
                <PlusIcon className={`h-12 w-12`} />
                <span className={` font-wsans font-medium text-center`}>
                  {fileHover ? (
                    `Relase to set as Card Image`
                  ) : (
                    <span className={` flex flex-col text-lg`}>
                      Drag and drop or click to add an image.
                      <span className={`text-sm`}>
                        Max file size 12MB(.png, .jpg, .jpeg, .gif)
                      </span>
                      <span className={`text-sm`}>
                        Recommended size 1024x340 px
                      </span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div
              className={`bg-gradient-to-r ${rarityGradientMap[rarity]} animate-gradient absolute top-0 left-0 w-full h-full -z-10`}
            />
          </div>
        </div>
        <div className={`flex flex-col gap-2 relative`}>
          <span className={`text-gray-300 font-wsans font-medium`}>
            Card Description
          </span>
          <textarea
            className="text-gray-300 bg-gray-850 p-4 rounded-2xl font-medium font-wsans focus:outline-none resize-none h-40 focus:ring-2 ring-0 ring-indigo-500 transition-all"
            value={cardDescription}
            onChange={(e) =>
              setCardDescription(e.target.value.substring(0, 200))
            }
          />
          <span
            className={`absolute bottom-0 right-0 text-gray-400 bg-gray-850/90 p-2 rounded-2xl text-xs`}
          >
            {cardDescription.length}/200
          </span>
        </div>

        <div className={`flex flex-row gap-4 justify-start w-full`}>
          <button
            className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
            onClick={async () => {
              if (updating) return;
              setUpdating(true);
              const res = await fetcher(
                `${await getGuildShardURL(
                  guild as string
                )}/guilds/${guild}/settings/cards`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: cardName,
                    description: cardDescription,
                    rarity: rarity,
                    base64: croppedFile,
                  }),
                }
              ).then((x) => x.json());
              if (res.error) {
                setError(res.error);
                setUpdating(false);
                return;
              } else {
                props.onUpdate();
                setUpdating(false);
              }
            }}
          >
            Create Card
          </button>
          {/* add revert button muted text button */}
        </div>
      </div>
      <Modal
        visible={!!fileURL}
        onClose={() => setFile(null)}
        className={`max-w-prose w-full max-h-[90%] h-fit p-8 flex flex-col gap-4`}
        noAnimation
      >
        <h2 className={`text-2xl font-poppins font-bold text-gray-50`}>
          Crop Rank Card
        </h2>
        {fileURL && (
          <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-xl w-full h-96">
            <Cropper
              image={fileURL}
              crop={crop}
              zoom={zoom}
              aspect={1024 / 340}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        )}
        <span className={`text-gray-400 text-sm`}>
          Drag to move the image around and use the mouse wheel to zoom
        </span>
        <button
          className={`rounded-2xl px-4 py-2 border border-gray-50/10 w-fit bg-gray-50/5 flex flex-row gap-2 items-center hover:bg-indigo-500 hover:border-transparent transition-all`}
          onClick={async () => {
            console.log("attempting to crop");
            if (!file) return;
            //  if its a png or jpg, use JIMP to crop
            //  if its a gif, use gifshot to crop
            console.log(file.type);
            if ([`image/png`, `image/jpeg`].includes(file.type)) {
              setProcessing(true);
              setProcessingProgress("Loading image...");
              const imgBuffer = Buffer.from(await file.arrayBuffer());
              console.log(Jimp);
              const image = await Jimp.read(imgBuffer);
              const crop = cropArea.current;
              const croppedImage = await image.crop(
                crop.x,
                crop.y,
                crop.width,
                crop.height
              );
              setProcessingProgress("Resizing image...");
              image.scaleToFit(1024, 340, Jimp.RESIZE_BEZIER);
              const croppedBuffer = await croppedImage.getBase64Async(
                "image/png"
              );
              setProcessingProgress("Done!");
              console.log(croppedBuffer.substring(0, 100));
              setCroppedFile(croppedBuffer);
              setFile(null);
            }
            console.log(file.type);
            if (file.type === `image/gif`) {
              setProcessing(true);
              setProcessingProgress("Loading conversion tools...");
              console.log(`cropping gif`);
              const imgBuffer = Buffer.from(await file.arrayBuffer());

              // const gifData = await codec.decodeGif(imgBuffer);
              // console.log(gifData);

              console.log(
                "FFMEPG LOADING",
                `${location.origin}/ffmpeg/dist/ffmpeg-core.js`
              );
              setProcessingProgress("Processing GIF...");
              const ffmpeg = createFFmpeg({
                mainName: "main",
                corePath:
                  "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
                progress: (e) => null,
              });
              // load ffmpeg.wasm code
              await ffmpeg.load();
              console.log("FFMEPG LOADED");
              // write file to  memory filesystem
              ffmpeg.FS("writeFile", file.name, new Uint8Array(imgBuffer));
              // convert video into mp4
              const crop = cropArea.current;
              await ffmpeg
                .run(
                  "-i",
                  file.name,
                  "-vf",
                  `crop=${crop.width}:${crop.height}:${crop.x}:${
                    crop.y
                  },scale=${1024}:${340}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=225[p];[s1][p]paletteuse=dither=sierra2_4a`,
                  "output.gif"
                )
                .catch((e) => {
                  console.log(e);
                });

              setProcessingProgress("Converting file...");

              // read file from Memory filesystem
              const data = Buffer.from(ffmpeg.FS("readFile", "output.gif"));
              console.log("FFMEPG DONE", data);

              const newGifDataURL = `data:image/gif;base64,${data.toString(
                `base64`
              )}`;

              console.log(newGifDataURL.substring(0, 100));
              setCroppedFile(newGifDataURL);
              setFile(null);
            }
            setProcessing(false);
          }}
          disabled={processing}
        >
          {processing
            ? processingProgress || `Processing image...`
            : `Looks good!`}
        </button>
      </Modal>
    </>
  );
};

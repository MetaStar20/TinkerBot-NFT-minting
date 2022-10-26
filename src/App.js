import { useState, useEffect, useRef } from "react";

import { ENVS } from "./config";
import contractABI from "./abis/abi.json";

import { Contract, providers, utils, ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { NotificationManager } from "react-notifications";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Buffer } from "buffer";

window.Buffer = window.Buffer || require("buffer").Buffer;

const last_frame_of_logo = 125;
const total_frames = 568;

const w = window.innerWidth;
const h = window.innerHeight;

const mint_index_start = 167;
const mint_index_end = 205;

const left_rect_of_mint = w * 0.35;
const top_rect_of_mint = h * 0.15;
const bottom_rect_of_mint = h * 0.85;
const right_rect_of_mint = w * 0.61;

const youtube_index_start = 320;
const youtube_index_end = 497;

const left_rect_of_youtube = w * 0.2;
const top_rect_of_youtube = h * 0.196;
const bottom_rect_of_youtube = h * 0.767;
const right_rect_of_youtube = w * 0.8;

const wallet_index_start = 125;
const wallet_index_end = 568;

const left_rect_of_wallet = w * 0.82;
const top_rect_of_wallet = h * 0.0309;
const bottom_rect_of_wallet = h * 0.0654;
const right_rect_of_wallet = w;

const mint_scroll_y = 3000;
const road_scroll_y = 4600;
const space_scroll_y = 9500;
const team_scroll_y = 25000;


const mint_top_rect = h * 0.0309;
const mint_bottom_rect = h * 0.0654;
const mint_left_rect = w * 0.3;
const mint_right_rect = w * 0.37;

const road_top_rect = h * 0.0309;
const road_bottom_rect = h * 0.0654;
const road_left_rect = w * 0.4;
const road_right_rect = w * 0.51;

const space_top_rect = h * 0.0309;
const space_bottom_rect = h * 0.0654;
const space_left_rect = w * 0.536;
const space_right_rect = w * 0.7;

const team_top_rect = h * 0.0309;
const team_bottom_rect = h * 0.0654;
const team_left_rect = w * 0.72;
const team_right_rect = w * 0.8;

function getCurrentFrame(index) {
  if (index < 10) {
    return require(`./assets/frames/FullWebsite0000${index}.webp`);
  } else if (index < 100) {
    return require(`./assets/frames/FullWebsite000${index}.webp`);
  } else {
    return require(`./assets/frames/FullWebsite00${index}.webp`);
  }
}

const ImageCanvas = ({
  scrollHeight,
  numFrames,
  width,
  height,
  walletConnect,
  onMintHandler,
}) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);

  function preloadImages() {
    for (let i = 1; i <= numFrames; i++) {
      const img = new Image();
      const imgSrc = getCurrentFrame(i);
      img.src = imgSrc;
      setImages((prevImages) => [...prevImages, img]);
    }
  }

  const handleScroll = () => {
    const scrollFraction = window.scrollY / (scrollHeight - window.innerHeight);
    const index = Math.min(
      numFrames - 1 - last_frame_of_logo,
      Math.ceil(scrollFraction * numFrames)
    );

    if (index <= 0 || index > numFrames) {
      return;
    }
    if (index < 5) {
      setFrameIndex(index);
    } else setFrameIndex(index + last_frame_of_logo);
  };

  const autoPlay = () => {
    setFrameIndex((preIndex) => {
      if (preIndex < last_frame_of_logo) return preIndex + 1;
      else return preIndex;
    });
  };

  const renderCanvas = () => {
    const context = canvasRef.current.getContext("2d");
    context.canvas.width = width;
    context.canvas.height = height;
  };

  useEffect(() => {
    preloadImages();
    renderCanvas();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      var x = event.x;
      var y = event.y;
      console.log(x, y);
      if (
        x > left_rect_of_mint &&
        x < right_rect_of_mint &&
        y > top_rect_of_mint &&
        y < bottom_rect_of_mint &&
        frameIndex > mint_index_start &&
        frameIndex < mint_index_end
      ) {
        console.log("mint section clicked");
        onMintHandler();
      } else if (
        x > left_rect_of_youtube &&
        x < right_rect_of_youtube &&
        y > top_rect_of_youtube &&
        y < bottom_rect_of_youtube &&
        frameIndex > youtube_index_start &&
        frameIndex < youtube_index_end
      ) {
        console.log("Youtube section clicked");
        window.open("https://youtu.be/QtccWDtlinU");
      } else if (
        x > left_rect_of_wallet &&
        x < right_rect_of_wallet &&
        y > top_rect_of_wallet &&
        y < bottom_rect_of_wallet &&
        frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end
      ) {
        console.log("My wallet section clicked");
        walletConnect();
      } else if (
        x > mint_left_rect &&
        x < mint_right_rect &&
        y > mint_top_rect &&
        y < mint_bottom_rect &&
        frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end
      ) {
        console.log("My menu - mint section clicked");
        window.scrollTo({
          top: mint_scroll_y,
          behavior: "smooth",
      });
      } else if (
        x > road_left_rect &&
        x < road_right_rect &&
        y > road_top_rect &&
        y < road_bottom_rect &&
        frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end
      ) {
        console.log("My menu - road section clicked");
        window.scrollTo({
          top: road_scroll_y,
          behavior: "smooth",
      });
      } else if (
        x > space_left_rect &&
        x < space_right_rect &&
        y > space_top_rect &&
        y < space_bottom_rect &&
        frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end
      ) {
        console.log("My menu - space section clicked");
        window.scrollTo({
          top: space_scroll_y,
          behavior: "smooth",
      });
      } else if (
        x > team_left_rect &&
        x < team_right_rect &&
        y > team_top_rect &&
        y < team_bottom_rect &&
        frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end
      ) {
        console.log("My menu - team section clicked");
        window.scrollTo({
          top: team_scroll_y,
          behavior: "smooth",
      });
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [frameIndex]);

  useEffect(() => {
    if (!canvasRef.current || images.length < 1) {
      return;
    }

    const context = canvasRef.current.getContext("2d");
    let requestId;

    const render = () => {
      context.drawImage(images[frameIndex], 0, 0);
      requestId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(requestId);
  }, [frameIndex, images]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoPlay();
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: scrollHeight }} useMap="#workmap">
      <canvas ref={canvasRef} />
    </div>
  );
};

const App = () => {
  const [provider, setProvider] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      console.log("connect...");
      if (window.ethereum) {
        const web3Provider = await detectEthereumProvider();
        const addressArray = await web3Provider.request({
          method: "eth_requestAccounts",
        });
        const walletChainId = await web3Provider.request({
          method: "eth_chainId",
        });
        setAccount(addressArray[0]);

        console.log(addressArray[0]);
        setProvider(web3Provider);
      }
    } catch (error) {
      setError(error);
    }
  };

  const mintNFT = async (walletAddress) => {
    setMintLoading(true);

    try {
      const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = infuraProvider.getSigner();
      const contract = new ethers.Contract(
        ENVS.CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      var walletList = [
        "0xC75DE6d76048239AA40040DEc2DabE2Da4E5AE89",
        "0x5C9E2A6fEc34b510996a8e2a3d1e2c47A382a8b9",
        "0xd63c2b1649a1f5e2bb7A4d09A66b74d0B23dfD07",
      ];

      console.log(walletAddress);

      // rootHash : e65be91ecf56e8c8ebe9fa90860753f9b58419ae72b8029371556efd370e4f08
      let index = walletList.indexOf(ethers.utils.getAddress(walletAddress));
      let hexProof;

      if (index != -1) {
        const leafNodes = walletList.map((addr) =>
          keccak256(addr).toString("hex")
        );
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
          sortPairs: true,
        });
        const rootHash = merkleTree.getHexRoot();
        hexProof = merkleTree.getHexProof(leafNodes[index]);
        console.log(rootHash);
      } else {
        hexProof = [
          "0x4b1c361c6c8ee4236a2509fc0c596140f86d5a49ec3bb9da97074421f8ded499",
          "0x928ae65c2e7bee6b7978217ffdb422e1b79b24f3e9032764590c0edec4687d8b",
        ];
      }

      let txhash = await contract.mintToken(1, hexProof, {
        value: ethers.BigNumber.from(1e9).mul(
          ethers.BigNumber.from(1e9).mul(0).div(100).mul(1)
        ),
        from: walletAddress,
      });

      let res = await txhash.wait();
      setMintLoading(false);

      if (res.transactionHash) {
        return {
          success: true,
          status: `Successfully minted !`,
        };
      } else {
        return {
          success: false,
          status: "Transaction failed",
        };
      }
    } catch (err) {
      setMintLoading(false);
      console.log(err);
      return {
        success: false,
        status: err.message,
      };
    }
  };

  const getContractWithoutSigner = () => {
    const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      ENVS.CONTRACT_ADDRESS,
      contractABI,
      infuraProvider
    );

    return contract;
  };

  const getIsSaleActive = async () => {
    const contract = getContractWithoutSigner();
    try {
      let isActive = await contract.saleIsActive();
      return isActive;
    } catch (err) {
      return false;
    }
  };

  const onMintHandler = async () => {
    let saleIsActive = await getIsSaleActive();
    if (saleIsActive) {
      setMintLoading(true);
      const web3Provider = await detectEthereumProvider();
      const addressArray = await web3Provider.request({
        method: "eth_requestAccounts",
      });
      const { success, status } = await mintNFT(addressArray[0]);
      if (success) {
        NotificationManager.success(
          "Congratulations. One NFT is  successfully minted !"
        );
      } else if (status.indexOf("insufficient fund") >= 0) {
        NotificationManager.info("Info. You don't have enough eths to mint!");
      } else if (status.indexOf("presale is not open") >= 0) {
        NotificationManager.info("Presale is not open !");
      } else if (status.indexOf("Not whitelist") >= 0) {
        NotificationManager.info(
          "Your wallet address is not whitelisted. Please wait for the Public Sale !"
        );
      } else {
        NotificationManager.info("Transaction is failed !");
      }
    } else {
      NotificationManager.info("Sale is not Open!");
    }
  };

  return (
    <main>
      <ImageCanvas
        scrollHeight={30000}
        width={1920}
        height={1080}
        numFrames={total_frames}
        walletConnect={connectWallet}
        onMintHandler={onMintHandler}
      />
      <NotificationContainer />
    </main>
  );
};

export default App;

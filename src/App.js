import { useState, useEffect, useRef } from "react";

import { ENVS } from "./config";
import contractABI from "./abis/abi.json";

import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { NotificationManager } from "react-notifications";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import socialBar from "./assets/img/socialBar.png";
import socialRec from "./assets/img/socialRec.png";
import spaceVideo from "./assets/video/SpaceBall.mp4";

import { isMobile } from "react-device-detect";
import ReactPlayer from "react-player";

window.Buffer = window.Buffer || require("buffer").Buffer;
const youtubeURL = "https://youtu.be/QtccWDtlinU";

const last_frame_of_logo = 125;

const total_frames = 406;
const total_frames_mobile = 384;

const width = 1920;
const height = 1080;

const width_mobile = 414;
const height_mobile = 896;

const w = window.innerWidth;
const h = window.innerHeight;

const mint_index_start = 167;
const mint_index_end = 205;

const top_rect_of_mint = isMobile ? h * 0.18 : h * 0.15;
const bottom_rect_of_mint = isMobile ? h * 0.5 : h * 0.85;
const left_rect_of_mint = isMobile ? w * 0.1 : w * 0.35;
const right_rect_of_mint = isMobile ? w * 0.95 : w * 0.61;

const youtube_index_start = isMobile ? 320 : 315;
const youtube_index_end = isMobile ? 354 : 374;

// variable when the menu will be displayed.

const wallet_index_start = last_frame_of_logo;
const wallet_index_end = isMobile ? total_frames_mobile : total_frames;

// For menu scroll

const mint_scroll_y = isMobile ? 3600 : 2000;
const road_scroll_y = isMobile ? 4500 : 4300;
const space_scroll_y = isMobile ? 9400 : 8600;
const team_scroll_y = isMobile ? 14000 : 16000;

// For Menu

const mint_top_rect = isMobile ? h * 0.097 : h * 0.0309;
const mint_bottom_rect = isMobile ? h * 0.114 : h * 0.0654;
const mint_left_rect = isMobile ? w * 0.252 : w * 0.3;
const mint_right_rect = isMobile ? w * 0.436 : w * 0.37;

const road_top_rect = isMobile ? h * 0.097 : h * 0.0309;
const road_bottom_rect = isMobile ? h * 0.114 : h * 0.0654;
const road_left_rect = isMobile ? w * 0.467 : w * 0.4;
const road_right_rect = isMobile ? w * 0.733 : w * 0.51;

const space_top_rect = isMobile ? h * 0.116 : h * 0.0309;
const space_bottom_rect = isMobile ? h * 0.138 : h * 0.0654;
const space_left_rect = isMobile ? w * 0.053 : w * 0.536;
const space_right_rect = isMobile ? w * 0.41 : w * 0.7;

const team_top_rect = isMobile ? h * 0.116 : h * 0.0309;
const team_bottom_rect = isMobile ? h * 0.138 : h * 0.0654;
const team_left_rect = isMobile ? w * 0.443 : w * 0.72;
const team_right_rect = isMobile ? w * 0.615 : w * 0.8;

const top_rect_of_wallet = isMobile ? h * 0.116 : h * 0.0309;
const bottom_rect_of_wallet = isMobile ? h * 0.138 : h * 0.0654;
const left_rect_of_wallet = isMobile ? w * 0.641 : w * 0.82;
const right_rect_of_wallet = isMobile ? w * 0.96 : w;

function getCurrentFrame(index) {
  const path = isMobile
    ? "./assets/frames_mobile/TinkerMobile_"
    : "./assets/frames/FullWebsite_";
  if (index < 10) {
    return require(`${path}0000${index}.webp`);
  } else if (index < 100) {
    return require(`${path}000${index}.webp`);
  } else {
    return require(`${path}00${index}.webp`);
  }
}

const Embedvideo = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
    <video
      loop
      muted
      autoplay
      playsinline
      class="player-wrapper"
    ><source src="${props.url}" type="video/mp4" /> </video>
  `,
      }}
    ></div>
  );
};

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
      }  else if (
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
    <div style={{ height: scrollHeight }}>
      <canvas ref={canvasRef} className="basicLayer" />
      {frameIndex > youtube_index_start && frameIndex < youtube_index_end && <Embedvideo url={spaceVideo} />}
    </div>
  );
};

const App = () => {
  const [provider, setProvider] = useState("");
  const [mintLoading, setMintLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [isSocialVisible, setIsSocialVisible] = useState(false);
  const [socialH, setSocialH] = useState(0);
  const [socialW, setSocialW] = useState(0);

  const handleSocialClickEvent = () => {
    if (!isSocialVisible) setIsSocialVisible(true);
    else setIsSocialVisible(false);
  };

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

  useEffect(() => {
    const height = document.getElementById("socialMenu").clientHeight;
    const width = document.getElementById("socialMenu").clientWidth;
    // update the state
    setSocialH(height);
    setSocialW(width);
  }, [isSocialVisible]);

  return (
    <main>
      <ImageCanvas
        scrollHeight={20000}
        width={isMobile ? width_mobile : width}
        height={isMobile ? height_mobile : height}
        numFrames={isMobile ? total_frames_mobile : total_frames}
        walletConnect={connectWallet}
        onMintHandler={onMintHandler}
      />
      <div className="socialSection">
        <img
          src={isSocialVisible ? socialRec : socialBar}
          className="social"
          alt="social"
          onClick={handleSocialClickEvent}
          useMap="#socialMap"
          id="socialMenu"
        />
      </div>
      {isSocialVisible && (
        <map name="socialMap">
          <area
            shape="rect"
            coords={
              socialW * 0.125 + "," + 15 + "," + socialW * 0.2375 + "," + 60
            }
            alt="twitter"
            href="https://twitter.com"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.2375 + "," + 15 + "," + socialW * 0.4375 + "," + 60
            }
            alt="discord"
            href="https://discord.com"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.4375 + "," + 15 + "," + socialW * 0.5625 + "," + 60
            }
            alt="instagram"
            href="https://instagram.com"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.5625 + "," + 15 + "," + socialW * 0.6875 + "," + 60
            }
            alt="opensea"
            href="https://opensea.io"
          />
          <area
            shape="rect"
            coords={
              socialW * 0.6875 + "," + 15 + "," + socialW * 0.875 + "," + 60
            }
            alt="youtube"
            href="https://youtube.com"
          />
        </map>
      )}

      <NotificationContainer />
    </main>
  );
};

export default App;

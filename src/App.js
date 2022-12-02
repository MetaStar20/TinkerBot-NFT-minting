/* eslint-disable no-script-url */
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
import LoadingTxt from "./assets/img/loadingTxt.gif";
import LoadingImg from "./assets/img/loading.gif";
import MintDlgImg from "./assets/img/mint_dialog.png";
import MintCommingDlgImg from "./assets/img/mint_comming_dialog.png";
import MintWhiteDlgImg from "./assets/img/mint_comming_white_dialog.png";

import FlexModalWrapper from "react-modal-wrapper";
import "react-modal-wrapper/dist/main.css"; // to load default styles

import { isMobile } from "react-device-detect";

window.Buffer = window.Buffer || require("buffer").Buffer;

const last_frame_of_logo = isMobile ? 148 : 150;

const total_frames = 392;
const total_frames_mobile = 383;

const width = 1920;
const height = 1080;

const width_mobile = 414;
const height_mobile = 896;

const w = window.innerWidth;
const h = window.innerHeight;

const mint_index_start = 167;
const mint_index_end = 205;

const roadmap_index_Start = mint_index_end;
const roadmap_index_end = isMobile ? 300 : 305;

const space_index_Start = roadmap_index_end;
const space_index_end = isMobile ? 370 : 368;

const team_index_Start = space_index_end;
const team_index_end = isMobile ? total_frames_mobile : total_frames;

const top_rect_of_mint = isMobile ? h * 0.18 : h * 0.15;
const bottom_rect_of_mint = isMobile ? h * 0.5 : h * 0.85;
const left_rect_of_mint = isMobile ? w * 0.1 : w * 0.35;
const right_rect_of_mint = isMobile ? w * 0.95 : w * 0.61;

const youtube_index_start = isMobile ? 320 : 315;
const youtube_index_end = isMobile ? 354 : 374;

// variable when the menu will be displayed.

const wallet_index_start = last_frame_of_logo - 1;
const wallet_index_end = isMobile ? total_frames_mobile : total_frames;

const mint_scroll_y = isMobile ? 2300 : 2000;
const road_scroll_y = isMobile ? 3300 : 3300;
const space_scroll_y = isMobile ? 9700 : 8800;
const team_scroll_y = isMobile ? 11700 : 11700;

const walletList = [
  "0xC75DE6d76048239AA40040DEc2DabE2Da4E5AE89",
  "0x5C9E2A6fEc34b510996a8e2a3d1e2c47A382a8b9",
  "0xd63c2b1649a1f5e2bb7A4d09A66b74d0B23dfD07",
];

const goTo = (pos) => {
  window.scrollTo({
    top: pos,
    behavior: "smooth",
  });
};

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

const Loading = ({ isLoading }) => {
  return (
    <div className={`loading ${isLoading ? "" : "fade-hide"}`}>
      <img alt="loading" src={LoadingTxt} id="text" />
      <img alt="loading" src={LoadingImg} id="icon" />
    </div>
  );
};

const Embedvideo = (props) => {
  return (
    <iframe
      src="https://www.youtube.com/embed/QtccWDtlinU"
      title="Space of Ball"
      frameBorder="0"
      className="player-wrapper"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  );
};

const getWindowDimensions = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    width,
    height,
  };
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const ImageCanvas = ({
  scrollHeight,
  numFrames,
  width,
  height,
  connectWallet,
  onMintHandler,
  isLoading,
  walletAddress,
}) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const mMintRef = useRef(null);
  const mRoadRef = useRef(null);
  const mSpaceRef = useRef(null);
  const mTeamRef = useRef(null);
  const mintDlgRef = useRef(null);

  const [mintDlgW, setMintDlgW] = useState(0);
  const [mintDlgH, setMintDlgH] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isWhitelist, setIsWhitelist] = useState(false);

  const mintDlgWRef = useRef(0);
  const mintDlgHref = useRef(0);

  const Menu = ({ connectWallet }) => {
    return (
      <div className="menuSection">
        <div className="menu__logo" onClick={() => goTo(0)} />
        <div
          className="menu__mint"
          onClick={() => goTo(mint_scroll_y)}
          ref={mMintRef}
        />
        <div
          className="menu__roadmap"
          onClick={() => goTo(road_scroll_y)}
          ref={mRoadRef}
        />
        <div
          className="menu__space"
          onClick={() => goTo(space_scroll_y)}
          ref={mSpaceRef}
        />
        <div
          className="menu__team"
          onClick={() => goTo(team_scroll_y)}
          ref={mTeamRef}
        />
        <div className="menu__wallet" onClick={() => connectWallet()} />
      </div>
    );
  };

  const MobileMenu = ({ connectWallet }) => {
    return (
      <div>
        <div className="menuSection">
          <div className="menu__logo" onClick={() => goTo(0)} />
          <div className="menu__second">
            <div
              className="menu__mint"
              onClick={() => goTo(mint_scroll_y)}
              ref={mMintRef}
            />
            <div
              className="menu__roadmap"
              onClick={() => goTo(road_scroll_y)}
              ref={mRoadRef}
            />
          </div>
          <div className="menu__third">
            <div
              className="menu__space"
              onClick={() => goTo(space_scroll_y)}
              ref={mSpaceRef}
            />
            <div
              className="menu__team"
              onClick={() => goTo(team_scroll_y)}
              ref={mTeamRef}
            />
            <div className="menu__wallet" onClick={() => connectWallet()} />
          </div>
        </div>
      </div>
    );
  };

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

    if (index <= 0 || index > numFrames - last_frame_of_logo) {
      return;
    }

    if (index >= 5) setFrameIndex(index + last_frame_of_logo);
    else setFrameIndex(index);

    // For menu selection.
    const current = index + last_frame_of_logo;
    if (
      current > mint_index_start &&
      current < mint_index_end &&
      mMintRef.current.className.search("menu__mint__active") == -1
    ) {
      mMintRef.current.className += " menu__mint__active";
    } else if (
      current > roadmap_index_Start &&
      current < roadmap_index_end &&
      mRoadRef.current.className.search("menu__roadmap__active") == -1
    ) {
      mRoadRef.current.className += " menu__roadmap__active";
    } else if (
      current > space_index_Start &&
      current < space_index_end &&
      mSpaceRef.current.className.search("menu__space__active") == -1
    ) {
      mSpaceRef.current.className += " menu__space__active";
    } else if (
      current > team_index_Start &&
      current < team_index_end &&
      mTeamRef.current.className.search("menu__team__active") == -1
    ) {
      mTeamRef.current.className += " menu__team__active";
    }
  };

  useEffect(() => {
    console.log(walletAddress);
    if (new Date().getTime() > new Date("2022-11-10").getTime())
      setIsOpen(true);
    if (
      walletAddress &&
      walletList.indexOf(ethers.utils.getAddress(walletAddress)) !== -1
    ) {
      console.log("whitelist");
      setIsWhitelist(true);
    }
  }, [walletAddress]);

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  const autoPlay = () => {
    if (!isLoading)
      setFrameIndex((preIndex) => {
        if (preIndex < last_frame_of_logo) return preIndex + 1;
        else if (preIndex === last_frame_of_logo) {
          window.scrollTo({
            top: ((scrollHeight - window.innerHeight) / numFrames) * 6,
          });
          return preIndex;
        } else return preIndex;
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      autoPlay();
    }, 40);
    return () => clearInterval(interval);
  }, [isLoading]);

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
        !isMobile &&
        x > left_rect_of_mint &&
        x < right_rect_of_mint &&
        y > top_rect_of_mint &&
        y < bottom_rect_of_mint &&
        frameIndex > mint_index_start &&
        frameIndex < mint_index_end
      ) {
        console.log("mint section clicked");
        connectWallet();
        setShowDialog(true);
        setTimeout(() => {
          setMintDlgW(mintDlgRef.current.clientWidth);
          setMintDlgH(mintDlgRef.current.clientHeight);
        }, 100);
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

  return (
    <div style={{ height: scrollHeight }}>
      <canvas ref={canvasRef} className="basicLayer" />
      {frameIndex > wallet_index_start &&
        frameIndex < wallet_index_end &&
        (isMobile ? (
          <MobileMenu connectWallet={connectWallet} />
        ) : (
          <Menu connectWallet={connectWallet} />
        ))}
      {frameIndex > youtube_index_start && frameIndex < youtube_index_end && (
        <Embedvideo />
      )}

      {isMobile &&
        frameIndex > mint_index_start + 25 &&
        frameIndex < mint_index_end && (
          <div className="mobile__mint__section">
            <img
              className="mobile__mint__dialog"
              src={
                
                   MintDlgImg

              }
              useMap="#mintMobileMap"
              alt="Mint Mobile Dialog"
            />

            <map name="mintMobileMap">
              <area
                shape="rect"
                coords={
                  window.innerWidth * 0.387 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.5 +
                  "," +
                  window.innerWidth * 0.455 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.575
                }
                alt="one"
                href="javascript: void(0);"
                onClick={() => {
                  onMintHandler(1);
                }}
              />
              <area
                shape="rect"
                coords={
                  window.innerWidth * 0.455 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.5 +
                  "," +
                  window.innerWidth * 0.538 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.575
                }
                alt="two"
                href="javascript: void(0);"
                onClick={() => {
                  onMintHandler(2);
                }}
              />
              <area
                shape="rect"
                coords={
                  window.innerWidth * 0.538 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.5 +
                  "," +
                  window.innerWidth * 0.612 +
                  "," +
                  ((window.innerWidth * 972) / 1117) * 0.575
                }
                alt="three"
                href="javascript: void(0);"
                onClick={() => {
                  onMintHandler(3);
                }}
              />
            </map>
          </div>
        )}

      {showDialog && (
        <FlexModalWrapper
          className="modal"
          closeOnEsc
          closeOnOutsideClick
          isOpened={showDialog}
          onClose={() => {
            setShowDialog(false);
          }}
        >
          <img
            className="mint__dialog"
            src={

                 MintDlgImg

            }
            useMap="#mintMap"
            ref={mintDlgRef}
            alt="Mint Dialog"
          />

          <map name="mintMap">
            <area
              shape="rect"
              coords={
                mintDlgW * 0.387 +
                "," +
                mintDlgH * 0.5 +
                "," +
                mintDlgW * 0.455 +
                "," +
                mintDlgH * 0.575
              }
              alt="one"
              href="javascript: void(0);"
              onClick={() => {
                 onMintHandler(1);
              }}
            />
            <area
              shape="rect"
              coords={
                mintDlgW * 0.455 +
                "," +
                mintDlgH * 0.5 +
                "," +
                mintDlgW * 0.538 +
                "," +
                mintDlgH * 0.575
              }
              alt="two"
              href="javascript: void(0);"
              onClick={() => {
                onMintHandler(2);
              }}
            />
            <area
              shape="rect"
              coords={
                mintDlgW * 0.538 +
                "," +
                mintDlgH * 0.5 +
                "," +
                mintDlgW * 0.612 +
                "," +
                mintDlgH * 0.575
              }
              alt="three"
              href="javascript: void(0);"
              onClick={() => {
                 onMintHandler(3);
              }}
            />
          </map>
        </FlexModalWrapper>
      )}
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
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

  const mintNFT = async (walletAddress, amnt) => {
    setMintLoading(true);

    try {
      const infuraProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = infuraProvider.getSigner();
      const contract = new ethers.Contract(
        ENVS.CONTRACT_ADDRESS,
        contractABI,
        signer
      );

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

      let txhash = await contract.mintToken(amnt, hexProof, {
        value: ethers.BigNumber.from(1e9).mul(
          ethers.BigNumber.from(1e9).mul(amnt).div(100).mul(1)
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

  const onMintHandler = async (amnt) => {
    console.log("MintHandler : ", amnt);
    let saleIsActive = await getIsSaleActive();
    if (saleIsActive) {
      setMintLoading(true);
      const web3Provider = await detectEthereumProvider();
      const addressArray = await web3Provider.request({
        method: "eth_requestAccounts",
      });
      const { success, status } = await mintNFT(addressArray[0], amnt);
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

  const hideLoading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  // This will run one time after the component mounts
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      console.log("page loaded");
      // do something else
      hideLoading();
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <main>

      {showLoading ? <Loading isLoading={isLoading} /> : null}

      <ImageCanvas
        scrollHeight={20000}
        width={isMobile ? width_mobile : width}
        height={isMobile ? height_mobile : height}
        numFrames={isMobile ? total_frames_mobile : total_frames}
        connectWallet={connectWallet}
        onMintHandler={onMintHandler}
        isLoading={showLoading}
        walletAddress={account}
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
              socialW * 0.125 + "," + 15 + "," + socialW * 0.2375 + "," + 100
            }
            alt="twitter"
            href="https://twitter.com/TinkeRobots"
            target="_blank"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.2375 + "," + 15 + "," + socialW * 0.4375 + "," + 100
            }
            alt="discord"
            href="https://discord.gg/EVfza6FZ"
            target="_blank"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.4375 + "," + 15 + "," + socialW * 0.5625 + "," + 100
            }
            alt="instagram"
            href="https://www.instagram.com/pixelparadisogames/"
            target="_blank"
          />

          <area
            shape="rect"
            coords={
              socialW * 0.5625 + "," + 15 + "," + socialW * 0.6875 + "," + 100
            }
            alt="opensea"
            href="https://opensea.io"
            target="_blank"
          />
          <area
            shape="rect"
            coords={
              socialW * 0.6875 + "," + 15 + "," + socialW * 0.875 + "," + 100
            }
            alt="youtube"
            href="https://www.youtube.com/@pixelparadisogames"
            target="_blank"
          />
        </map>
      )}

      <NotificationContainer />
    </main>
  );
};

export default App;

import { Stack, useMantineTheme } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import React, { useState } from "react";
import styled from "styled-components";
import { SimulationCard } from "../Simulations/Simulations";
import {
  CarouselTabs,
  ISimulation,
} from "../_New/NewPageDesign/ModifiedOptionsSim";
import { isValidYouTubeLink } from "../WebsiteBuilder/FooterEdit";
import { convertToEmbedLink } from "../../utilities/HelperFunctions";
import { useMediaQuery } from "@mantine/hooks";

interface SimulationCarouselProps {
  videos: {
    _id: string;
    name: string;
    description: string;
    url: string;
    thumbnail?: string;
  }[];
  setCurrentTab: (s: any) => void;
}

const VideoCarousel: React.FC<SimulationCarouselProps> = ({
  videos,
  setCurrentTab,
}) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`);
  return (
    <Container hasVideos={videos.length !== 0}>
      <StyledInfoContainer>
        <h2>Your Videos</h2>
        <p>Build & Share Your Own Video Collection!</p>
        <button
          onClick={() => {
            setCurrentTab(CarouselTabs.video);
          }}
        >
          View All
        </button>
      </StyledInfoContainer>
      <StyledCarouselConainter>
        {videos.length && (
          <StyledCarousel
            loop
            sx={{
              "&:[data-inactive]": {
                opacity: 100,
                cursor: "default",
              },
            }}
          >
            {videos.map((x) => (
              <SlideContainer>
                <VideoContainer key={x._id}>
                  {isValidYouTubeLink(x.url) && (
                    <iframe
                      onContextMenu={(e) => e.preventDefault()}
                      allow="fullscreen"
                      src={convertToEmbedLink(x.url)}
                      allowFullScreen
                    ></iframe>
                  )}
                  {!isValidYouTubeLink(x.url) && (
                    <video
                      src={x?.url}
                      // width={isMd ? "100%" : "50%"}
                      // style={{
                      //   aspectRatio: 16 / 9,
                      //   margin: "auto",
                      //   width: isMd ? "100%" : "auto",
                      //   height: isMd ? "auto" : "50vh",
                      // }}
                      controls
                      controlsList="nodownload"
                    />
                  )}
                  <div style={{ backgroundColor: "white" }} className="innner">
                    <h2>{x.name}</h2>
                    <p>
                      {x.description.length < 40
                        ? x.description
                        : x.description.substring(0, 39) + "..."}
                    </p>
                  </div>
                </VideoContainer>
              </SlideContainer>
            ))}
          </StyledCarousel>
        )}

        <ImageContainer>
          <StyledImage
            alt="Person"
            src={require("../../assets/EmptyVideo.png")}
            style={
              {
                // width: isMd ? "45%" : "40%",
                // aspectRatio: '1/1',
                // maxHeight: `${isMd ? '200px' : '250px'}`,
                // scale: `${isLg || isMd ? '1.03' : '1.07'}`
              }
            }
          />
        </ImageContainer>
      </StyledCarouselConainter>
    </Container>
  );
};

export default VideoCarousel;

const ImageContainer = styled.div`
  position: absolute;
  z-index: 0;
  @media (max-width: 1220px) {
    right: 40px;
  }
  @media (max-width: 1100px) {
    right: auto;
  }
  @media (max-width: 450px) {
    left: 10px;
  }
`;

const StyledImage = styled.img`
  @media (max-width: 1100px) {
    /* position: absolute;
    z-index: 0; */
    scale: 0.88;
  }
`;
interface ContainerProps {
  hasVideos: boolean;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  flex: 1;
  justify-content: ${(props) =>
    !props?.hasVideos ? "center" : "space-between"};
  align-items: center;
  background-color: #5ab2a6;
  min-height: 250px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10px;
  border-radius: 12px;
  padding: 0px 3px;
  @media (max-width: 1100px) {
    min-height: 221px;
    margin: 10px 0;
    flex-direction: ${(props) => (!props?.hasVideos ? "row" : "row-reverse")};
  }
  @media (max-width: 500px) {
    max-height: 200px;
  }
`;

const StyledInfoContainer = styled.div`
  z-index: 2;
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  max-width: 161px;
  @media (max-width: 1500px) {
    max-width: 121px;
  }
  @media (max-width: 1100px) {
    /* width: 100%; */
    margin-right: 15px;
  }
  @media (max-width: 1000px) {
    margin-left: 0;
    max-width: 161px;
  }
  @media (max-width: 500px) {
    max-width: 121px;
  }
  @media (max-width: 900px) {
    font-size: 16px;
  }

  h2 {
    margin: 0;
    width: fit-content;
    color: white;
    font-size: 24px;
    font-weight: 700;
    white-space: nowrap; // Prevents the text from wrapping

    @media (max-width: 900px) {
      font-size: 16px;
    }
  }
  span {
    color: white;
    font-size: 24px;
    @media (max-width: 900px) {
      font-size: 17px;
      margin: 0;
    }
  }

  p {
    color: white;
    font-family: "Nunito";
    font-weight: 400;
    font-size: 16px;
    line-height: 21.82px;
    @media (max-width: 900px) {
      font-size: 12.25px;
      margin: 0;
    }
    padding: 20px 0;
  }
  button {
    text-align: center;
    font-weight: 700;
    color: white;
    width: 109px;
    background-color: transparent;
    border: 1px white solid;
    color: white;
    width: fit-content;
    border-radius: 4px;
    padding: 5px 9px 5px 9px;
    font-family: "Nunito";
    font-size: 16px;
    cursor: pointer;
    @media (max-width: 720px) {
      font-size: 12.25px;
      margin: 0;
    }
  }
`;

const StyledCarouselConainter = styled.div`
  /* flex: 1; */
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1100px) {
  }
  /* @media (max-width: 1100px) {
    margin: 30px 0;
  } */
`;

const StyledCarousel = styled(Carousel)`
  z-index: 2;
  cursor: pointer;
  .mantine-Stack-root {
    padding: 0;
    div {
      margin-top: 0;
    }
  }
  .mantine-Carousel-viewport {
    height: 100% !important;
  }
  max-width: 441px;
  @media (max-width: 1550px) {
    max-width: 341px;
  }
  @media (max-width: 1300px) {
    max-width: 290px;
  }
  @media (max-width: 1100px) {
    max-width: 441px;
    /* padding: 20px 0; */
  }

  /* @media (max-width: 850px) {
    max-width: 350px;
  } */
  @media (max-width: 650px) {
    max-width: 300px;
  }
  @media (max-width: 450px) {
    max-width: 250px;
  }
  @media (max-width: 400px) {
    max-width: 220px;
  }
  @media (max-width: 350px) {
    max-width: 190px;
  }
  @media (max-width: 300px) {
    max-width: 160px;
  }
`;

const VideoContainer = styled.div`
  width: 80%;
  /* height: 100%; */
  aspect-ratio: 1.7;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin: 0px 30px 0px 30px; */

  video {
    background-color: black;
    width: 100%;
    /* position: relative; */
    aspect-ratio: 16/7;
    border: 1px black solid;
    border-radius: 12px 12px 0 0;
    border-bottom: 0;
  }
  iframe {
    background-color: black;
    width: 100%;
    /* position: relative; */
    border: 1px black solid;
    border-radius: 12px 12px 0 0;
    border-bottom: 0;
    aspect-ratio: 16/7;
    /* @media (max-width: 1000px) {
      aspect-ratio: 16/9;
    } */
  }

  div {
    /* max-height: 185px; */
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 2px;
    box-sizing: border-box;
    border: 1px #707070 solid;
    border-top: 0;
    border-radius: 0 0 12px 12px;
    /* padding: 5px 0 0 5px; */
    h2 {
      margin: 0;
      font-weight: 700;
      font-size: 16px;
      padding-left: 5px;
    }
    p {
      color: #626262;
      font-size: 10.2px;
      margin: 0;
      margin-left: 10px;
      padding-bottom: 15px;
    }
  }
`;

const SlideContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* margin: 5px 20px 5px 20px; */
  @media (max-width: 1000px) {
    width: 100%;
    padding-right: 0;
  }
`;

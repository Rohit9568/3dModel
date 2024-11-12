import { SimpleGrid, useMantineTheme } from "@mantine/core";
import React, { useEffect } from "react";
import styled from "styled-components";
import { isValidYouTubeLink } from "../../components/WebsiteBuilder/FooterEdit";
import { IconDeleteContent } from "../../components/_Icons/CustonIcons";
import { convertToEmbedLink } from "../../utilities/HelperFunctions";
import { useMediaQuery } from "@mantine/hooks";

interface IProps {
  currentChapter: SingleChapter;
}

const Videospage: React.FC<IProps> = (props) => {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <>
      <h2 style={{}}>Shared Videos</h2>
      <DynamicSimpleGrid w="100%" px={10} cols={isMd ? 2 : 3} isMd={isMd}>
        {props?.currentChapter?.videos?.map((x) => (
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
            <div>
              <div
                style={{ backgroundColor: "white" }}
                className="info-conatiner"
              >
                <h2>{x.name}</h2>
                <p>
                  {x.description.length < 40
                    ? x.description
                    : x.description.substring(0, 39) + "..."}
                </p>
              </div>
            </div>
          </VideoContainer>
        ))}
      </DynamicSimpleGrid>
    </>
  );
};

export default Videospage;

interface IGridProps {
  isMd: boolean;
}

const DynamicSimpleGrid = styled(SimpleGrid)<IGridProps>`
  width: 100%;
  padding: 32px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  align-items: start;
  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 4px;
  position: relative;
  width: 100%;

  video {
    width: 100%;
    aspect-ratio: 16 / 9;
    /* min-height: 70% ; */
    position: relative;
    border: 1px black solid;
    border-radius: 6px 6px 0 0;
    border-bottom: 0;
  }
  iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
    /* min-height: 70% ; */
    position: relative;
    border: 1px black solid;
    border-radius: 6px 6px 0 0;
    border-bottom: 0;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px #707070 solid;
    border-top: 0;
    border-radius: 0 0 6px 6px;
    button {
      background-color: transparent;
      border: 0;
      cursor: pointer;
    }
  }
  .info-conatiner {
    background-color: white;
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    border-top: 0;
    padding: 5px 0 0 5px;
    border: 0px;
    h2 {
      margin: 0;
      font-weight: 500;
      font-size: 14px;
    }
    p {
      color: #626262;
      font-size: 12px;
      margin: 0;
      margin-left: 10px;
      padding-bottom: 10px;
    }
  }
`;

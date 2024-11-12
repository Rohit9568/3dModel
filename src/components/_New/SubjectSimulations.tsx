import { Center, Modal, SimpleGrid } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { fetchAllSimulationWithPagination } from "../../features/Simulations/getSimulationSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/ReduxStore";
import { SimulationCard } from "./SimulationIntroCard";
import { useMediaQuery } from "@mantine/hooks";
import { ContentSimulation } from "../../pages/SimulationPage/ContentSimulation";
import { CanvasDraw } from "../../pages/DetailsPages/CanvasDraw";
import { useLocation, useNavigate } from "react-router-dom";
import { User1 } from "../../@types/User";
export function AllSubjectSimualtions() {
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [filteredSimulations, setFilteredSimulation] = useState<
    SimulationData[] | null
  >(null);
  const [isComplete, setisComplete] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const currentSubject = useSelector<RootState, SingleSubject>((state) => {
    return state.subjectSlice.currentSubject;
  });
  const [playSimulation, setPlaySimulation] = useState<null | SimulationData>(
    null
  );
  const simulationFilter = currentSubject.simulationFilter;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const isSm = useMediaQuery(`(max-width: 610px)`);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("play");
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const user = useSelector<RootState, User1 | null>((state) => {
    return state.currentUser.user;
  });
  useEffect(() => {
    if (!paramValue) {
      setPlaySimulation(null);
    }
  }, [paramValue]);
  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, []);

  useEffect(() => {
    setPlaySimulation(null);
  }, []);
  useEffect(() => {
    setFilteredSimulation(() => {
      const prevState1 = simulations.filter((x) => {
        let found = false;
        x.simultionfilters.map((y) => {
          if (y == simulationFilter) found = true;
        });
        return found !== false;
      });
      return prevState1;
    });
  }, [simulationFilter, simulations]);

  useEffect(() => {
    if (
      !isComplete &&
      !loadingData &&
      filteredSimulations &&
      filteredSimulations.length < 10
    ) {
      setSkip((prev) => {
        return prev + 12;
      });
    }
  }, [filteredSimulations]);
  useEffect(() => {
    if (skip > 0 && !isComplete) {
      setLoadingData(true);
      fetchAllSimulationWithPagination(skip)
        .then((data) => {
          setLoadingData(false);
          const simulations = data as SimulationData[];
          setSimulations((curr) => [...curr, ...simulations]);
        })
        .catch((error) => {
          console.log(error);
          setisComplete(true);
          setLoadingData(false);
        });
    }
  }, [skip]);

  useEffect(() => {
    setLoadingData(true);
    fetchAllSimulationWithPagination(0)
      .then((data) => {
        setLoadingData(false);
        const simulations = data as SimulationData[];
        setSimulations(simulations);
      })
      .catch((error) => {
        setLoadingData(false);
      });
  }, []);

  const handleScroll = () => {
    if (!isComplete && !loadingData) {
      const container = scrollAreaRef.current;
      if (
        container &&
        Math.ceil(container.scrollTop + container.clientHeight) + 5 >=
          container.scrollHeight
      ) {
        setSkip((prev) => {
          return prev + 12;
        });
      }
    }
  };
  const navigate = useNavigate();

  return (
    <div
      style={{ height: "100%", overflowY: "scroll", marginLeft: "25px" }}
      onScroll={handleScroll}
      ref={scrollAreaRef}
    >
      <SimpleGrid cols={isSm ? 1 : isMd ? 2 : 3} spacing="xl" mt={10}>
        {filteredSimulations &&
          filteredSimulations.map((x) => {
            return (
              <SimulationCard
                key={x._id}
                _id={x._id}
                name={x.name}
                imageUrl={x.thumbnailImageUrl}
                setLoading={setLoadingData}
                setPlaySimulation={() => {
                  // navigate(`${currentUrl}?play=true`);
                  setPlaySimulation(x);
                }}
                isSimulationPremium={x.isSimulationPremium}
                userSubscriptionType={user?.subscriptionModelType ?? ""}
              />
            );
          })}
      </SimpleGrid>
      <Modal
        opened={playSimulation !== null}
        onClose={() => {
          setPlaySimulation(null);
          // navigate('/allsimualtions')
        }}
        withCloseButton={false}
        closeOnClickOutside={false}
        // lockScroll
        styles={{
          inner: {
            padding: 0,
            margin: 0,
            // border:'blue solid 1px'
          },
          root: {
            padding: 0,
            margin: 0,
            // border:'violet solid 1px'
          },
          modal: {
            // border:'violet solid 1px',
            padding: 0,
            margin: 0,
          },
        }}
        // size="xl"
        size="auto"
        m={0}
        padding={0}
        lockScroll
        // centered
        fullScreen
      >
        {/* <div
        style={{
          width:'100%',
          height:'100%',
          border:'red solid 1px'
        }}
        // w="100%"
        // h="100%"
        > */}
        {/* </div> */}

        {playSimulation !== null && (
          <CanvasDraw
            onCloseClick={() => {
              setPlaySimulation(null);
              // navigate(-1);
            }}
            simulation={playSimulation}
          >
            <Center
              style={{
                height: "100%",
                width: "100%",
                // border:'red solid 1px'
              }}
            >
              <ContentSimulation simulationId={playSimulation._id} />
            </Center>
          </CanvasDraw>
        )}
      </Modal>
    </div>
  );
}

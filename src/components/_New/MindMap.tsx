import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowDown,
  IconChevronDown,
  IconPlus,
  IconTrash,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMindmap,
  fetchMindmap,
  updateMindmap,
} from "../../features/Mindmap/MindmapSlice";
import { RootState } from "../../store/ReduxStore";
import { chapter } from "../../store/chapterSlice";
import { hideLongStrings } from "../../utilities/HelperFunctions";
const chapterActions = chapter.actions;
const nodeBGColors = [
  "#9747FF",
  "#0D99FF",
  "#14AE5C",
  "#FFCD29",
  "#FFA629",
  "#F24822",
];
const nodeTextColors = ["white", "white", "white", "black", "black", "white"];
function MindMapDropDown(props: {
  mindmaps: any[];
  currentMindmap: any;
  setCurrentMindMap: (mindmap: any) => void;
}) {
  return (
    <Box
      pos={"fixed"}
      right={20}
      top={100}
      m={0}
      p={0}
      w={150}
      style={{ zIndex: 2 }}
    >
      <Select
        data={props?.mindmaps.map((mindmap, i) => {
          return {
            value: mindmap._id,
            label: mindmap.name,
          };
        })}
        value={props?.currentMindmap._id}
        onChange={(val) => {
          if (val)
            fetchMindmap(val)
              .then((data) => {
                props?.setCurrentMindMap(JSON.parse(JSON.stringify(data)));
              })
              .catch((e) => {
                console.log(e);
              });
        }}
        rightSection={<IconChevronDown />}
      />
    </Box>
  );
}

export function MindMap(props: { mindmaps: Mindmap[] }) {
  const isMd = useMediaQuery(`(max-width: 820px)`);
  const currentUserChapter = useSelector<RootState, SingleChapter>((state) => {
    return state.chapterSlice.currentChapter;
  });
  const dispatch = useDispatch();
  const [currentMindmap, setCurrentMindmap] = useState<Mindmap>(
    JSON.parse(JSON.stringify(props?.mindmaps[0] || ""))
  );
  useEffect(() => {
    setCurrentMindmap(JSON.parse(JSON.stringify(props?.mindmaps?.[0] || "")));
  }, [props?.mindmaps]);
  const [selectedNode, setSelectedNode] = useState<any>();
  const [newNodeModalOpened, setNewNodeModalOpened] = useState<boolean>(false);
  const [newMindMapModalOpened, setNewMindMapModalOpened] =
    useState<boolean>(false);

  const [modalInput, setModalInput] = useState<string>("");
  const [modalInput2, setModalInput2] = useState<string>("");

  const onNodeClick = (node: any) => {
    setSelectedNode(node);
  };
  const onAddNodeClick = () => {
    setModalInput("");
    setNewNodeModalOpened(true);
  };
  const addNode = (name: string) => {
    setModalInput("");
    if (selectedNode) {
      selectedNode.children.push({ name: name, children: [] });
      updateMindmap({
        formObj: { data: currentMindmap.data },
        mindmapId: currentMindmap._id,
      });
    }
    setSelectedNode(null);
  };
  const deleteNode = (parent: any) => {
    if (selectedNode) {
      if (parent === null) {
        setSelectedNode(null);
        window.alert("Can't Delete Root");
        return;
      }
      parent.children = parent.children.filter((x: any) => {
        if (x !== selectedNode) return x;
      });
      updateMindmap({
        formObj: { data: currentMindmap.data },
        mindmapId: currentMindmap._id,
      });
      setSelectedNode(null);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <Box
        pos={"fixed"}
        bottom={isMd ? "10%" : "3%"}
        left={!isMd ? "50%" : "0"}
        style={{
          display: "flex",
          flex: "1",
          justifyContent: "center",
          width: `${isMd ? "100%" : "inherit"}`,
        }}
      >
        <Button
          fw={450}
          fz={15}
          leftIcon={<IconPlus size={20} />}
          onClick={() => {
            setNewMindMapModalOpened(true);
          }}
          style={{ borderRadius: 10 }}
          styles={{ leftIcon: { margin: 0, padding: 2 } }}
          bg="#4B65F6"
        >
          <Text>Create New</Text>
        </Button>
      </Box>
      {props?.mindmaps?.length > 0 && (
        <MindMapDropDown
          currentMindmap={currentMindmap}
          mindmaps={props?.mindmaps}
          setCurrentMindMap={setCurrentMindmap}
        />
      )}
      <Modal
        centered
        opened={newNodeModalOpened}
        onClose={() => setNewNodeModalOpened(false)}
        title="Add Node"
      >
        <Stack>
          <TextInput
            label="Title"
            value={modalInput}
            onChange={(e) => setModalInput(e.currentTarget.value)}
          />
          <Button
            disabled={modalInput.trim().length < 1}
            onClick={() => {
              addNode(modalInput);
              setNewNodeModalOpened(false);
            }}
          >
            Create
          </Button>
        </Stack>
      </Modal>
      {/* New Mindmap Modal*/}
      <Modal
        centered
        opened={newMindMapModalOpened}
        onClose={() => setNewMindMapModalOpened(false)}
        title="Create a New Mindmap"
      >
        <Stack>
          <TextInput
            label="Name"
            value={modalInput}
            onChange={(e) => setModalInput(e.currentTarget.value)}
          />
          <TextInput
            label="Heading Text"
            value={modalInput2}
            onChange={(e) => setModalInput2(e.currentTarget.value)}
          />
          <Button
            disabled={
              modalInput.trim().length < 1 || modalInput2.trim().length < 1
            }
            onClick={() => {
              createMindmap({
                formObj: {
                  name: modalInput,
                  data: { name: modalInput2, children: [] },
                },
                userChapterId: currentUserChapter._id,
              })
                .then((mindmap: any) => {
                  dispatch(chapterActions.updateMindmaps(mindmap));
                  setCurrentMindmap(JSON.parse(JSON.stringify(mindmap)));
                })
                .catch((e) => {
                  console.log(e);
                });
              setNewMindMapModalOpened(false);
              setModalInput("");
              setModalInput2("");
            }}
          >
            Create
          </Button>
        </Stack>
      </Modal>

      <Box
        mih={1000}
        pt={50}
        style={{
          backgroundImage: `url(${require("../../assets/MindMapBackground.png")}`,
          backgroundRepeat: "repeat",
        }}
      >
        {props?.mindmaps?.length > 0 && (
          <Box style={{ transform: "scale(1)" }}>
            <MindmapNode
              data={currentMindmap.data}
              isRoot={true}
              selectedNode={selectedNode}
              onNodeClick={onNodeClick}
              onAddNodeClick={onAddNodeClick}
              onDeleteNodeClick={deleteNode}
              parent={null}
              bgColorIndex={0}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}
export function MindmapNode(props: {
  data: any;
  isRoot: boolean;
  selectedNode: any;
  parent: any;
  onAddNodeClick: () => void;
  onDeleteNodeClick: (parent: any) => void;
  onNodeClick: (node: any) => void;
  bgColorIndex: number;
}) {
  return (
    <Box m={10} mt={props?.isRoot ? 20 : 0}>
      <Center>
        <Stack spacing={0} m={0} p={0}>
          <Stack spacing={0} p={0} m={0}>
            {!props?.isRoot && (
              <Center>
                <Box w={2} h={20} bg={"black"} />
              </Center>
            )}
            <Center>
              <Stack spacing={2} m={0} p={0}>
                {props?.data?.name ? (
                  <Box
                    p={props?.data === props?.selectedNode ? 2 : 0}
                    style={{
                      borderRadius: 10,
                      border:
                        props?.data === props?.selectedNode
                          ? "4px #3174F3 solid"
                          : "",
                    }}
                  >
                    <Text
                      w={150}
                      h={75}
                      bg={nodeBGColors[props?.bgColorIndex]}
                      c={nodeTextColors[props?.bgColorIndex]}
                      style={{
                        borderRadius: 10,
                      }}
                      onClick={() => props?.onNodeClick(props?.data)}
                    >
                      <Center h={"100%"}>
                        {hideLongStrings(props?.data?.name || "", 12)}
                      </Center>
                    </Text>
                  </Box>
                ) : (
                  <></>
                )}
                {props?.data?.name ? (
                  <Center m={0} p={0}>
                    {props?.data === props?.selectedNode && (
                      <>
                        <Box
                          bg="#3174F3"
                          w={25}
                          h={25}
                          style={{ borderRadius: "50%" }}
                          onClick={() => props?.onAddNodeClick()}
                        >
                          <Center>
                            <IconArrowDown color="white" />
                          </Center>
                        </Box>
                        <Box
                          bg="#3174F3"
                          w={25}
                          h={25}
                          p={2}
                          ml={5}
                          style={{ borderRadius: "50%" }}
                          onClick={() => {
                            props?.onDeleteNodeClick(props?.parent);
                          }}
                        >
                          <Center>
                            <IconTrash color="white" />
                          </Center>
                        </Box>
                      </>
                    )}
                  </Center>
                ) : (
                  <></>
                )}
              </Stack>
            </Center>
            {/* error before here */}
            {props?.data?.children?.length > 0 && (
              <>
                <Center>
                  <Box w={2} h={20} bg={"black"} />
                </Center>

                {props?.data?.children?.length > 1 && (
                  <Center>
                    <Divider color="black" size={2} w={"calc(100% - 168px)"} />
                  </Center>
                )}
              </>
            )}
          </Stack>
          <Flex justify={"center"}>
            {props?.data?.children?.map((x: any, index: any) => {
              return (
                <MindmapNode
                  data={x}
                  isRoot={false}
                  parent={props?.data}
                  selectedNode={props?.selectedNode}
                  onAddNodeClick={props?.onAddNodeClick}
                  onNodeClick={props?.onNodeClick}
                  onDeleteNodeClick={props?.onDeleteNodeClick}
                  bgColorIndex={
                    props?.bgColorIndex < nodeBGColors.length - 1
                      ? props?.bgColorIndex + 1
                      : 0
                  }
                  key={index}
                />
              );
            })}
          </Flex>
        </Stack>
      </Center>
    </Box>
  );
}

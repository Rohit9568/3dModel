import React, { useState } from "react";
import { Button, Checkbox, Flex, Paper, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { IconChevronLeft } from "@tabler/icons";
import { isPrimary, isSecondary } from "./Simulations";
import { useLocation } from "react-router-dom";
interface FilterComponentProps {
  labels: Simulationfilters[];
  onSubmit: (
    filteredParameters: {
      labelids: string[];
      type: string[];
      grade: string[];
      miscellaneous: boolean;
    },
    mobilegradeFilter: string[]
  ) => void;
  currentFilter: FilterParameters;
  setfilterclicked: (val: boolean) => void;
  onClose: () => void;
  userSubjects: UserClassAndSubjects[];
  myArray: string[];
  mobilegradeFilter: string[];
  setMobileGradeFilter: (val: React.SetStateAction<string[]>) => void;
  miscellaneous: boolean;
  setmiscellaneous: (val: React.SetStateAction<boolean>) => void;
}

const MobileFilterMain = (props: FilterComponentProps) => {
  const [isPrimaryCheck, setPrimaryCheck] = useState<boolean>(false);
  const [isSecondaryCheck, setSecondaryCheck] = useState<boolean>(false);
  const [filteredParameters, setfilteredParameters] = useState<{
    labelids: string[];
    type: string[];
    grade: string[];
    miscellaneous: boolean;
  }>({ labelids: [], type: [], grade: [], miscellaneous: true });

  useEffect(() => {
    props.setfilterclicked(true);
    return () => {
      props.setfilterclicked(false);
    };
  }, []);

  const [toggleItems, setToggleItems] = useState([true, false, false]);
  const handleToggle = (index: number) => {
    setToggleItems(Array(toggleItems.length).fill(false));
    setToggleItems((prevToggleItems) => {
      const updatedToggleItems = [...prevToggleItems];
      updatedToggleItems[index] = !updatedToggleItems[index];
      return updatedToggleItems;
    });
  };
  const gradesOnly = props.userSubjects.filter((x) => {
    if (x.grade !== -1) return true;
    return false;
  });

  const primaryClasses = gradesOnly.filter((x) => {
    return isPrimary(x.grade);
  });

  const primaryClassesArray = primaryClasses.map((x) => x.classId);

  const secondaryClasses = gradesOnly.filter((x) => {
    return isSecondary(x.grade);
  });
  const secondaryClassesArray = secondaryClasses.map((x) => x.classId);



  useEffect(() => {
    let types: any[] = [];
    if (props.currentFilter.type === null) {
      types = [];
    } else if (props.currentFilter.type === "BOTH") {
      types = ["FREE", "PREMIUM"];
    } else if (props.currentFilter.type === "FREE") {
      types = ["FREE"];
    } else {
      types = ["PREMIUM"];
    }

    // const myset = new Set<string>();

    // props.currentFilter.subjectIds.map((y) => {
    //   props.userSubjects.map((x) => {
    //     const found = x.subjects.find((z) => z.subjectId === y);
    //     if (found && x.grade >= 0 && x.grade <= 12) {
    //       myset.add(x.classId);
    //     }
    //   });
    // });
    // const aar1 = Array.from(myset);

    // props.setMobileGradeFilter(aar1);
    setfilteredParameters({
      grade: props.currentFilter.subjectIds,
      labelids: props.currentFilter.labelids,
      type: types,
      miscellaneous: props.currentFilter.miscellaneous,
    });
  }, [props.currentFilter]);

  useEffect(() => {
    if (props.mobilegradeFilter.length !== 0) {
      if (
        props.mobilegradeFilter.filter((x) => {
          return primaryClassesArray.includes(x);
        }).length === primaryClasses.length
      ) {
        setPrimaryCheck(true);
      } else {
        setPrimaryCheck(false);
      }
    }
  }, [props.mobilegradeFilter]);
  useEffect(() => {
    if (props.mobilegradeFilter.length !== 0) {
      if (
        props.mobilegradeFilter.filter((x) => {
          return secondaryClassesArray.includes(x);
        }).length === secondaryClasses.length
      ) {
        setSecondaryCheck(true);
      } else {
        setSecondaryCheck(false);
      }
    }
  }, [props.mobilegradeFilter]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // position: "fixed",
      }}
    >
      <Paper
        shadow="sm"
        p="xl"
        style={{
          width: "100%",
          height: "60px",
          padding: "5px",
          // position: "fixed",
          top: 0,
          zIndex: 2,
        }}
        className="header"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // marginTop: matches ? "" : "10px",
            }}
            onClick={() => {
              props.onClose();
            }}
          >
            <IconChevronLeft />
            <Text
              // onClick={close}
              style={{ fontWeight: 600 }}
            >
              Filters
            </Text>
          </div>
          <div
            style={{ margin: "13px" }}
            onClick={() => {
              setfilteredParameters({
                type: [],
                labelids: [],
                grade: [],
                miscellaneous: true,
              });
              props.setMobileGradeFilter([]);
            }}
          >
            Clear Filters
          </div>
        </div>
      </Paper>
      <div
        className="maincontent"
        style={{
          flex: 1,
          // overflowY: "auto",
          // paddingTop: "20px",
          // paddingBottom: "70px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "block",
              width: "142px",
              backgroundColor: "#EBEEF4",
              height: "100vh",
            }}
          >
            <div
              onClick={() => handleToggle(0)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                backgroundColor: toggleItems[0] ? "white" : "inherit",
                height: "81px",
                paddingLeft: "18px",
                marginTop: "-10px",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "20px" }}>Subjects</div>
              {filteredParameters.labelids.length !== 0 && (
                <span
                  style={{
                    color: "blue",
                    paddingRight: "10px",
                    fontWeight: 500,
                    fontSize: "18px",
                  }}
                >
                  {filteredParameters.labelids.length}
                </span>
              )}
            </div>

            <div
              onClick={() => handleToggle(2)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "81px",
                backgroundColor: toggleItems[2] ? "white" : "inherit",
                paddingLeft: "18px",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "20px" }}>Grades</div>
              {props.mobilegradeFilter.length !== 0 && (
                <span
                  style={{
                    color: "blue",
                    paddingRight: "10px",
                    fontWeight: 500,
                    fontSize: "18px",
                  }}
                >
                  {props.mobilegradeFilter.length +
                    (props.miscellaneous ? 1 : 0)}
                </span>
              )}
            </div>
          </div>

          <div style={{ flex: 2, padding: "20px 20px" }}>
            {toggleItems[0] && (
              <Checkbox.Group
                style={{ fontSize: "18px", fontWeight: 400 }}
                onChange={(val) => {
                  setfilteredParameters((prev: any) => {
                    return {
                      ...prev,
                      labelids: val,
                    };
                  });
                }}
                value={filteredParameters.labelids}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontWeight: 400,
                    fontSize: "18px",
                  }}
                >
                  {props.labels.map((subItem, subIndex: number) => (
                    <label
                      key={subIndex}
                      style={{
                        display: "block",
                        marginBottom: "0.6rem",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                    >
                      <Checkbox
                        size="lg"
                        label={subItem.subject}
                        style={{
                          fontWeight: 400,
                          fontSize: "18px",
                          height: "24px",
                          width: "24px",
                        }}
                        styles={{
                          label: { fontSize: "18px" },
                        }}
                        value={subItem._id}
                      />
                    </label>
                  ))}
                </div>
              </Checkbox.Group>
            )}

            {toggleItems[2] && (
              <Stack mt={20} spacing={10}>
                {primaryClasses.length > 0 && (
                  <Flex>
                    <Checkbox
                      checked={isPrimaryCheck}
                      onChange={(e) => {
                        if (isPrimaryCheck) {
                          props.setMobileGradeFilter((prev) => {
                            const prev1 = prev.filter((x) => {
                              return !primaryClassesArray.includes(x);
                            });
                            return prev1;
                          });
                          setPrimaryCheck(false);
                        } else {
                          props.setMobileGradeFilter((prev) => {
                            const prev1 = prev.filter((x) => {
                              return !primaryClassesArray.includes(x);
                            });
                            const prev2 = prev1.concat(primaryClassesArray);
                            return prev2;
                          });
                        }
                      }}
                      label="Primary School"
                      styles={{
                        label: {
                          fontSize: "18px",
                        },
                      }}
                    />
                  </Flex>
                )}

                <Checkbox.Group
                  value={props.mobilegradeFilter}
                  onChange={props.setMobileGradeFilter}
                  ml={20}
                  spacing={10}
                >
                  {primaryClasses.map((x) => {
                    return (
                      <Flex w="100%">
                        <Checkbox
                          value={x.classId}
                          label={"Grade " + x.grade}
                          styles={{
                            label: {
                              fontSize: "18px",
                            },
                          }}
                        ></Checkbox>
                      </Flex>
                    );
                  })}
                </Checkbox.Group>
                {secondaryClasses.length > 0 && (
                  <Checkbox
                    label="Secondary School"
                    checked={isSecondaryCheck}
                    styles={{
                      label: {
                        fontSize: "18px",
                      },
                    }}
                    mt={10}
                    onChange={(e) => {
                      if (isSecondaryCheck) {
                        props.setMobileGradeFilter((prev) => {
                          const prev1 = prev.filter((x) => {
                            return !secondaryClassesArray.includes(x);
                          });
                          return prev1;
                        });
                        setSecondaryCheck(false);
                      } else {
                        props.setMobileGradeFilter((prev) => {
                          const prev1 = prev.filter((x) => {
                            return !secondaryClassesArray.includes(x);
                          });
                          const prev2 = prev1.concat(secondaryClassesArray);
                          return prev2;
                        });
                      }
                    }}
                  >
                    Secondary School
                  </Checkbox>
                )}

                <Checkbox.Group
                  value={props.mobilegradeFilter}
                  onChange={props.setMobileGradeFilter}
                  ml={20}
                  spacing={10}
                >
                  {secondaryClasses.map((x) => {
                    return (
                      <Flex w="100%">
                        <Checkbox
                          value={x.classId}
                          label={"Grade " + x.grade}
                          styles={{
                            label: {
                              fontSize: "16px",
                            },
                          }}
                        ></Checkbox>
                      </Flex>
                    );
                  })}
                </Checkbox.Group>
                <Checkbox
                  // checked={isPrimaryCheck}
                  checked={props.miscellaneous}
                  onChange={(e) => {
                    props.setmiscellaneous((prev) => !prev);
                    // if (isPrimaryCheck) {
                    //   props.props.setMobileprops.mobilegradeFilter((prev) => {
                    //     const prev1 = prev.filter((x) => {
                    //       return !primaryClassesArray.includes(x);
                    //     });
                    //     return prev1;
                    //   });
                    // } else {
                    //   props.props.setMobileprops.mobilegradeFilter((prev) => {
                    //     const prev1 = prev.filter((x) => {
                    //       return !primaryClassesArray.includes(x);
                    //     });
                    //     const prev2 = prev1.concat(primaryClassesArray);
                    //     return prev2;
                    //   });
                    // }
                  }}
                  label="Miscellaneous "
                  styles={{
                    label: {
                      fontSize: "18px",
                    },
                  }}
                />
              </Stack>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "80px",
          position: "fixed",
          bottom: 0,
          zIndex: 999999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px -5px 5px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Button
          // onClick={close}
          size="xl"
          bg="#4B65F6"
          w="97%"
          onClick={() => {
            props.onSubmit(
              { ...filteredParameters, miscellaneous: props.miscellaneous },
              props.mobilegradeFilter
            );
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default MobileFilterMain;

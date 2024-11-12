import React, { Fragment, useEffect, useState } from "react";
import { IconCircle } from "@tabler/icons";
import { IconPenCursor } from "../_Icons/CustonIcons";
import { SideBarItems } from "../../@types/SideBar.d";

const CustomCursor = (props:{selectedItem:SideBarItems,divId:string}) => {
  const [isInRange, setIsInRange] = useState<boolean>(false);
  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const onMouseMove = (e: any) => {
    const cursor: any = document.querySelector(".custom-cursor");

    if (cursor) {
      const cursorRange = document.querySelector(`#${props.divId}`);

      if (cursorRange && cursorRange.contains(e.target)) {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
        setIsInRange(true);
      } else {
        setIsInRange(false);
      }
    }
  };
  return (
    <Fragment>
      <div
        className="custom-cursor"
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {
          isInRange && props.selectedItem===SideBarItems.Highlighter &&
          <IconCircle
            style={{
              width: "24px",
              height: "24px",
              pointerEvents: "none",
              position:'absolute',
              top:-10,
              left:-10
            }}
          />
        }
        {
          isInRange && props.selectedItem===SideBarItems.Pen &&
          <div
            style={{
              position:'absolute',
              top:-25,
            }}
          >
          <IconPenCursor
            col="#3174F3"
          />
          </div>
        }
      </div>
    </Fragment>
  );
};

export default CustomCursor;

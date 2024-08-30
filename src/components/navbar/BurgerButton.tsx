"use client";

import React, { useState } from "react";

// import { useSidebarContext } from "../layout/layout-context";
import { StyledBurgerButton } from "./navbar.styles";

export const BurguerButton = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={StyledBurgerButton()}
      // open={collapsed}
      onClick={() => {
        setCollapsed(!collapsed);
      }}
    >
      <div />
      <div />
    </div>
  );
};

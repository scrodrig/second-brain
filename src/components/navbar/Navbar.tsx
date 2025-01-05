"use client";

import { FcFeedback, FcSupport } from "react-icons/fc";
import { Link, Navbar, NavbarContent } from "@nextui-org/react";

import { BurguerButton } from "./BurgerButton";
import { NavbarBreadcums } from "./NavbarBreadcums";
import { NotificationsDropdown } from "./NotificationsDropdown";
import React from "react";
import { SlSocialGithub } from "react-icons/sl";
import { UserDropdown } from "./UserDropdown";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <NavbarBreadcums />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <div className="flex items-center gap-2 max-md:hidden">
            <FcFeedback />
            <span>Feedback?</span>
          </div>

          <NotificationsDropdown />
          
          <div className="max-md:hidden">
            <FcSupport />
          </div>

          <Link
            href="https://github.com/scrodrig"
            target={"_blank"}
          >
            <SlSocialGithub />
          </Link>
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};

import Link from "next/link";
import React from "react";
import { titleFont } from "@/config/fonts";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="/">
        <span className={`${titleFont.className} antialiased font-bold`}>
          Second brain
        </span>
        <span> | Life tracker </span>
        <span> &#169; {new Date().getFullYear()} </span>
      </Link>
    </div>
  );
};
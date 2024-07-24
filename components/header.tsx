"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { LayoutContext } from "./reducers/layout/layout-reducer";
import { cn } from "@/utils/tw";

export default function Header() {
  const { state: { layout } } = useContext(LayoutContext);

  return (
    <div className="flex flex-col gap-16 items-center">
      <div className={cn("flex gap-8 justify-between items-center w-full", {
        "mt-8": layout === "main"
      })}>
        <Link href="/">
          <Image
            src="/logo.webp"
            width={301 / (layout === "main" ? 1.5 : 2.5)}
            height={171 / (layout === "main" ? 1.5 : 2.5)}
            alt="Logo"
          />
        </Link>
        <h1 className={cn("title", {
          "!m-0": layout === "projector" || layout === "main-projector"
        })}>BINGO DISPLAYER</h1>
      </div>
    </div>
  );
}

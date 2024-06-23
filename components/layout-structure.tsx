"use client";
import Header from "@/components/Header";
import { LayoutContext } from "@/components/reducers/layout/layout-reducer";
import { useContext } from "react";

export function LayoutStructure({ children }: { children: React.ReactNode; }) {
  const { state: { layout } } = useContext(LayoutContext);

  if (layout === "projector" || layout === "main-projector") {
    return <>{children}</>
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col w-full gap-12 px-[80px]">
        <Header />
        <main className="flex-1 flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}

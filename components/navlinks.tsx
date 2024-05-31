"use client";
import { usePathname } from "next/navigation";
import ModelLink from "./modellink";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/router";

/*
  * Base - 0
  * QA - 2.75rem
  * 
*/

const supabase = createClient()

const models = [
  {
    name: "Base Mistral",
    path: "/dashboard/base",
  },
  {
    name: "Basic QA",
    path: "/dashboard/qa",
  },
  {
    name: "Chain of Thought QA",
    path: "/dashboard/cot",
  },
  {
    name: "Basic RAG",
    path: "/dashboard/rag",
  },
  {
    name: "Multihop RAG",
    path: "/dashboard/multihop",
  },
  {
    name: "Optimized Multihop",
    path: "/dashboard/optimized",
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  const currentIndex = useMemo(() => {
    return (2.75 * 16 + 2) * models.findIndex((model) => model.path === pathname);
  }, [pathname]);
  return (
    <div className='flex flex-col justify-between h-[calc(100vh-5rem)]'>
      <div className="flex flex-col gap-2 relative flex-grow">
        <div
          className={cn(
            currentIndex < 0 ? "opacity-0" : "opacity-100",
            "h-[2.3rem] min-w-full bg-gray-100 rounded-md z-10 absolute transition-all"
          )}
          style={{ top: `${currentIndex}px` }}
        ></div>
        {models.map((model, index) => {
          return (
            <ModelLink
              key={index}
              href={model.path}
              active={model.path === pathname}
            >
              {model.name}
            </ModelLink>
          );
        })}
      </div>
      <button className="text-sm" onClick={async () => {
          await supabase.auth.signOut()
          window.location.href = "/"
        }}>Sign Out</button>
    </div>
  );
}

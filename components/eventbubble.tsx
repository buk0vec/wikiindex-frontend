"use client";
import { useMemo, useState } from "react";
import { SSE } from "@/lib/sse";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";

export default function EventBubble({ response }: { response: SSE }) {
  const [open, setOpen] = useState(response.type === "client-response");
  const color = useMemo(() => {
    if (response.type === "mistral-response") {
      return "bg-yellow-200";
    }
    if (response.type === "client-response") {
      return "bg-green-200";
    }
    if (response.type === "colbert-response") {
      return "bg-purple-200";
    }
    if (response.type === "colbert-request") {
      return "bg-purple-200";
    }
    if (response.type === "mistral-query") {
      return "bg-yellow-200";
    }
    return "bg-gray-200";
  }, [response.type]);

  const description = useMemo(() => {
    if (response.type === "mistral-response") {
      return "Mistral response";
    }
    if (response.type === "client-response") {
      return "Client response";
    }
    if (response.type === "colbert-response") {
      return "ColBERT response";
    }
    if (response.type === "colbert-request") {
      return "ColBERT request";
    }
    if (response.type === "mistral-query") {
      return "Mistral query";
    }
    return "Unknown";
  }, [response.type]);

  const source = useMemo(() => {
    if (response.type === "mistral-response") {
      return "Mistral";
    }
    if (response.type === "client-response") {
      return "Server";
    }
    if (response.type === "colbert-response") {
      return "ColBERT";
    }
    if (response.type === "colbert-request") {
      return "Server";
    }
    if (response.type === "mistral-query") {
      return "Server";
    }
    return "Unknown";
  }, [response.type]);

  const destination = useMemo(() => {
    if (response.type === "mistral-response") {
      return "Server";
    }
    if (response.type === "client-response") {
      return "Client";
    }
    if (response.type === "colbert-response") {
      return "Server";
    }
    if (response.type === "colbert-request") {
      return "ColBERT";
    }
    if (response.type === "mistral-query") {
      return "Mistral";
    }
    return "Unknown";
  }, [response.type]);

  return (
    <Collapsible
      className={`p-2 rounded-md ${color} fade-in-100 duration-1000`}
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="w-full flex flex-row gap-4 items-baseline">
        <div className="flex flex-row gap-2 items-baseline flex-grow">
          <h3 className="font-bold text-xl font-serif">{source}</h3>
          <FaArrowRight />
          <h3 className="font-bold text-xl font-serif">{destination}</h3>
        </div>
        {/* <h4 className="flex-grow text-left text-lg font-light">
          {description}
        </h4> */}
        <FaChevronDown
          width={32}
          height="32"
          color="#000000"
          className={cn(open ? 'rotate-180' : 'rotate-0', "justify-self-end ")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent overflow-hidden">
        {response.type === "mistral-response" && <p>{response.data.message}</p>}
        {response.type === "client-response" && <p>{response.data.message}</p>}
        {response.type === "colbert-response" &&
        <ol className="list-decimal list-inside">
          {response.data.message.map((item, index) => (
            <li key={index} className="p-1">{item.text} (score: {item.score})</li>
          ))}
          </ol>}
        {response.type === "colbert-request" && <p>{response.data.query}</p>}
        {response.type === "mistral-query" && <p>{response.data.query}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}

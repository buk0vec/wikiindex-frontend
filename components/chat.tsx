"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { IoMdSend } from "react-icons/io";
import * as v from "valibot";
import EventBubble from "./eventbubble";
import { parseEvent, SSE } from "@/lib/sse";

type ChatProps = {
  title: string;
  model: string;
};



export default function Chat({ title, model }: ChatProps) {
  const [query, setQuery] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const ref = React.useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<SSE[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function submitQuery(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    if (query != "") {
      setLoading(true)
      setEvents([]);
      setLastQuery(query);
      // get sse from server
      const eventSource = new EventSource(
        `/api/model?model=${model}&query=${query}`
      );
      eventSource.onmessage = (e) => {
        console.log(e.data);
        try {
          const json = JSON.parse(e.data)
          console.log(json)
          const data = parseEvent(json);
          setEvents((events) => [...events, data]);
          if (data.type === "client-response") {
            console.log("Client response recieved");
            eventSource.close();
            setLoading(false)
          }
        }
        catch (e) {
          console.error(e);
          eventSource.close();
          setLoading(false)
        }
      };
    } else {
      ref.current?.focus();
    }
  }

  return (
    <div className="px-24 pt-4 flex flex-col w-full min-h-screen h-screen">
      <div className="w-full flex items-center flex-col">
        <h2 className="text-3xl font-bold font-serif px-2 py-2 rounded-md w-fit">
          {title}
        </h2>
      </div>
      <div className="text-center flex-grow font-serif font-semibold pb-2 text-xl italic opacity-70">{lastQuery}</div>
      <div className="flex flex-col gap-4 overflow-y-scroll pb-4">
        {events.map((event, index) => (
          <EventBubble response={event} key={index} />
        ))}
        <div ref={(el) => el?.scrollIntoView()}></div>
      </div>
        <form className="justify-self-end mb-6 w-full bg-slate-200 flex flex-row items-center rounded-xl border-slate-600 border-2 pr-2">
        <input
          className="border-0 focus:ring-0 flex-grow focus:ring-offset-0 bg-slate-200 outline-none mx-2 placeholder:text-gray-600 my-4 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ask a question here"
          disabled={loading} onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <Button
          variant="outline"
          className="rounded-3xl bg-slate-200 border-white"
          size="icon"
          onClick={submitQuery}
          disabled={loading}
        >
          <IoMdSend size={20} />
        </Button>
      </form>
    </div>
  );
}

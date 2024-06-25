import { NextRequest } from "next/server";
// @ts-expect-error
import EventSource from "eventsource";
import { parseEvent } from "@/lib/sse";
import { createClient } from "@/lib/supabase/server";
export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

global.EventSource = EventSource;

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const model = searchParams.get("model");
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  let responseStream = new TransformStream();
  let writer = responseStream.writable.getWriter();
  if (user.data.user === null) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!query || !model) {
    return new Response("Missing query or model", { status: 400 });
  }

  const requests24h = await supabase.rpc("get_request_count_24h");

  if (requests24h.data > 100) {
    writer.write(
      `data: {"source": "server", "to": "client", "message": "Sorry, you've made too many requests. Try again tomorrow and thanks for checking the project out!"}\n\n`
    );
  } else {
    await supabase.from("logging").insert([
      {
        model: model,
        query: query,
      },
    ]);

    const eventSource = new EventSource(
      `${process.env.API_BASE}/${model}?query=${query}`
    );

    // @ts-expect-error
    eventSource.onmessage = (e) => {
      console.log(e.data);
      try {
        writer.write(`data: ${e.data}\n\n`);
        const json = JSON.parse(e.data);
        console.log(json);
        const data = parseEvent(json);
        if (data.type === "client-response") {
          console.log("Client response recieved");
          eventSource.close();
          writer.close();
        }
      } catch (e) {
        console.error(e);
        eventSource.close();
        writer.close();
      }
    };
  }

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

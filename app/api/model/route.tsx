import { NextRequest } from "next/server";
// @ts-expect-error
import EventSource from "eventsource";
import { parseEvent } from "@/lib/sse";
import { createClient } from "@/lib/supabase/server";
export const runtime = 'nodejs';
// This is required to enable streaming
export const dynamic = 'force-dynamic';

global.EventSource = EventSource;

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const model = searchParams.get('model')
  const supabase = createClient();
  const user = await supabase.auth.getUser()
  if (user.data.user === null) {
    return new Response('Unauthorized', { status: 401 })
  }
 
  if (!query || !model) {
    return new Response('Missing query or model', { status: 400 })
  }

  await supabase.from('logging').insert([{
    model: model,
    query: query,
  }])

  let responseStream = new TransformStream();
  let writer = responseStream.writable.getWriter();

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_API_BASE}/${model}?query=${query}`
  );

  // @ts-expect-error
  eventSource.onmessage = (e) => {
    console.log(e.data);
    try {
      writer.write(`data: ${e.data}\n\n`);
      const json = JSON.parse(e.data)
      console.log(json)
      const data = parseEvent(json);
      if (data.type === "client-response") {
        console.log("Client response recieved");
        eventSource.close();
        writer.close();
      }
    }
    catch (e) {
      console.error(e);
      eventSource.close();
      writer.close();
    }
  }

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
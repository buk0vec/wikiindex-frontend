import Chat from "@/components/chat";

export default function Home() {
  return (
    <main className="min-h-screen max-w-[calc(100%-260px)] min-w-[calc(100%-260px)] bg-pine-glade-200">
      <Chat title="Optimized Multihop RAG" model="multihop-optimized"/>
    </main>
  );
}

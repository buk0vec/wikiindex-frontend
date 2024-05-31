import { ButtonLink } from "@/components/buttonlink";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 bg-pine-glade-100">
      <h1 className="text-6xl font-extrabold font-serif">WikiIndex</h1>
      <p>A research demo to visualize how retrieval augmented generation (RAG) applications answer questions</p>
      <ButtonLink href="/dashboard">Get started</ButtonLink>
    </main>
  );
}

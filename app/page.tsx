import { ButtonLink } from "@/components/buttonlink";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 bg-pine-glade-100">
      <h1 className="text-6xl font-extrabold font-serif">WikiIndex</h1>
      <p>A research demo to visualize how retrieval augmented generation (RAG) applications answer questions</p>
      <p>Note: this doesn&apos;t work anymore since I stopped paying for the cloud resources to run it. Sorry!</p>
      <ButtonLink href="/dashboard">Get started</ButtonLink>
      <p>Created by <a href="https://bukovec.dev" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">Nick Bukovec</a></p>
    </main>
  );
}

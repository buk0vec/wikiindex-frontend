"use client";
import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";

const supabase = createClient();

const env = process.env.NODE_ENV

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-pine-glade-100">
      <a className="text-6xl font-extrabold font-serif" href="/">WikiIndex</a>
      <div className="w-[75%]">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["github", "google"]}
          redirectTo={env === "development" ? "http://localhost:3000/auth/callback" : "https://wikiindex.vercel.app/auth/callback"}
          onlyThirdPartyProviders={true}
        />
      </div>
    </div>
  );
}

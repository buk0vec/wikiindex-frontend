import NavLinks from "@/components/navlinks";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return (
    <div className="relative z-0 flex h-full w-full overflow-hidden">
      <div className="overflow-x-hidden w-[260px] bg-zambezi-200 px-2">
        <a href="/" className="text-3xl font-bold tracking-tight pt-4 pb-4 font-serif inline-block">WikiIndex</a>
        <NavLinks />
      </div>
      {children}
    </div>
  );
}


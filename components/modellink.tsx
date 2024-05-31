import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

type ModelLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

export default function ModelLink({ href, children, active }: ModelLinkProps) {
  return (
    <div className={cn(!active ? "hover:border-gray-100" : "", "z-20 border rounded-md border-transparent ")}>
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 p-2 border-transparent text-sm text-gray-800 rounded-md transition-colors "
      )}
    >
      {children}
    </Link>
    </div>
  );
}

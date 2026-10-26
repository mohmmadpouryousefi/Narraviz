import Link from "next/link";
import { Construction } from "lucide-react";

/** Temporary placeholder for routes that are built in a later phase. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center">
      <Construction className="h-8 w-8 text-muted-foreground" aria-hidden />
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link href="/" className="text-sm font-medium text-data-primary hover:underline">
        Back to home
      </Link>
    </div>
  );
}

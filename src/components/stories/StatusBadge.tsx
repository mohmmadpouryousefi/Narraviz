import { Badge } from "@/components/ui/badge";
import type { StoryStatus } from "@/types/story";

export function StatusBadge({ status }: { status: StoryStatus }) {
  return status === "published" ? (
    <Badge className="bg-data-success/15 text-foreground hover:bg-data-success/15">Published</Badge>
  ) : (
    <Badge variant="secondary">Draft</Badge>
  );
}

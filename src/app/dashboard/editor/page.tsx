import { redirect } from "next/navigation";
import { StoryEditor } from "@/components/editor/StoryEditor";

export const metadata = { title: "Edit story · Narraviz" };

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) redirect("/dashboard/stories");
  // key resets the editor's local state when switching between stories.
  return <StoryEditor key={id} id={id} />;
}

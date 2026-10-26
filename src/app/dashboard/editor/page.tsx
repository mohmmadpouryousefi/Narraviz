import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function Page() {
  return (
    <DashboardLayout>
      <ComingSoon title="Story editor" description="The story editor is coming soon." />
    </DashboardLayout>
  );
}

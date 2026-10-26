import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function Page() {
  return (
    <DashboardLayout>
      <ComingSoon title="Datasets" description="Dataset upload is coming soon." />
    </DashboardLayout>
  );
}

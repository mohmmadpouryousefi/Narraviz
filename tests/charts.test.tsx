import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import type { ChartPoint } from "@/types/dataset";

const categories: ChartPoint[] = [
  { x: "EU", y: 1200 },
  { x: "US", y: 900 },
  { x: "APAC", y: 300 },
];

const series: ChartPoint[] = [
  { x: "2024-01-01", y: 10 },
  { x: "2024-01-02", y: 25 },
  { x: "2024-01-03", y: 18 },
];

describe("BarChart", () => {
  it("renders one bar per point with an accessible label", () => {
    const { container } = render(<BarChart data={categories} xType="string" xLabel="Region" yLabel="Revenue" width={600} />);
    expect(screen.getByRole("figure", { name: "Revenue by Region" })).toBeInTheDocument();
    expect(container.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(3);
  });

  it("shows category labels on the axis", () => {
    render(<BarChart data={categories} xType="string" width={600} />);
    expect(screen.getByText("APAC")).toBeInTheDocument();
  });

  it("shows an empty state without data", () => {
    render(<BarChart data={[]} xType="string" />);
    expect(screen.getByRole("status")).toHaveTextContent("No data to chart");
  });
});

describe("LineChart", () => {
  it("renders a line with one dot per point", () => {
    const { container } = render(<LineChart data={series} xType="date" xLabel="Date" yLabel="Orders" width={600} />);
    expect(screen.getByRole("figure", { name: "Orders over Date" })).toBeInTheDocument();
    expect(container.querySelector(".recharts-line-curve")).not.toBeNull();
    expect(container.querySelectorAll(".recharts-line-dot")).toHaveLength(3);
  });

  it("formats date ticks", () => {
    render(<LineChart data={series} xType="date" width={600} />);
    expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
  });

  it("shows an empty state without data", () => {
    render(<LineChart data={[]} xType="date" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

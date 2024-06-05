import DashboardGrid from "./_components/DashboardGrid"
import Filter from "@/components/Filter"

import { redirect } from "next/navigation"

const Dashboard = async ({
  searchParams,
}: {
  searchParams: { range?: "day" | "week" | "month" }
}) => {
  if (searchParams.range && !["day", "week", "month"].includes(searchParams.range))
    redirect("/dashboard")

  return (
    <>
      <section className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Filter searchParamKey="range" defaultOptions="day" options={["day", "week", "month"]} />
        </div>
        <DashboardGrid range={searchParams.range || "day"} />
      </section>
    </>
  )
}

export default Dashboard

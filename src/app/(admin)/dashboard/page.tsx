import DashboardGrid from "./_components/DashboardGrid"
import Range from "./_components/Range"

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { fetchDashboardData } from "@/server-actions/dashboard"
import { redirect } from "next/navigation"

const Dashboard = async ({ searchParams }: { searchParams: { range?: string } }) => {
  const qc = new QueryClient()

  await qc.prefetchQuery({
    queryKey: ["dashboard", "day"],
    queryFn: () => fetchDashboardData("day"),
  })

  if (searchParams.range && !["day", "week", "month"].includes(searchParams.range))
    redirect("/dashboard")

  if (searchParams.range)
    await qc.prefetchQuery({
      queryKey: ["dashboard", searchParams.range],
      queryFn: () => fetchDashboardData(searchParams.range!),
    })

  return (
    <>
      <section className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Range />
        </div>
        <HydrationBoundary state={dehydrate(qc)}>
          <DashboardGrid range={searchParams.range || "day"} />
        </HydrationBoundary>
      </section>
    </>
  )
}

export default Dashboard

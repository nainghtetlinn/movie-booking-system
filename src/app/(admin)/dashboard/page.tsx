import { Suspense } from "react"
import DashboardGrid from "./_components/DashboardGrid"
import TodayActiveShows from "./_components/TodayActiveShows"
import Filter from "@/components/Filter"
import { Skeleton } from "@/components/ui/skeleton"

import { redirect } from "next/navigation"

const Dashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ range?: "day" | "week" | "month" }>
}) => {
  const { range } = await searchParams
  if (range && !["day", "week", "month"].includes(range)) redirect("/dashboard")

  return (
    <>
      <section className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Filter searchParamKey="range" defaultOptions="day" options={["day", "week", "month"]} />
        </div>
        <DashboardGrid range={range || "day"} />
      </section>

      <Suspense
        fallback={
          <section className="p-4 pt-0">
            <Skeleton className="mb-4 h-8 w-64 rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Skeleton className="h-[220px] rounded-lg" />
              <Skeleton className="h-[220px] rounded-lg" />
              <Skeleton className="h-[220px] rounded-lg" />
              <Skeleton className="h-[220px] rounded-lg" />
            </div>
          </section>
        }>
        <TodayActiveShows />
      </Suspense>
    </>
  )
}

export default Dashboard

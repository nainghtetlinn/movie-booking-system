"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clapperboard, DollarSign, Film, Ticket } from "lucide-react"

import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData } from "@/server-actions/dashboard"

const DashboardGrid = ({ range }: { range: string }) => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["dashboard", range],
    queryFn: () => fetchDashboardData(range),
  })

  if (isLoading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
        <Skeleton className="h-[150px] rounded-lg" />
      </div>
    )

  if (isSuccess)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Sales</h3>
            <DollarSign className="h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{data.sales.toLocaleString()} Ks</CardTitle>
            <CardDescription className="text-xs">
              Total of {data.totalSales.toLocaleString()} Ks sales
            </CardDescription>
          </CardContent>
        </Card>

        {/* Tickets card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Tickets</h3>
            <Ticket className="h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{data.tickets.toLocaleString()} Tickets</CardTitle>
            <CardDescription className="text-xs">
              Total of {data.totalTickets.toLocaleString()} tickets
            </CardDescription>
          </CardContent>
        </Card>

        {/* Movies card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Movies</h3>
            <Film className="h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{data.movies.toLocaleString()} Movies</CardTitle>
            <CardDescription className="text-xs">
              Total of {data.totalMovies.toLocaleString()} movies
            </CardDescription>
          </CardContent>
        </Card>

        {/* Shows card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Shows</h3>
            <Clapperboard className="h-6 w-6" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardTitle>{data.shows.toLocaleString()} Shows</CardTitle>
            <CardDescription className="text-xs">
              Total of {data.totalShows.toLocaleString()} shows
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
}

export default DashboardGrid

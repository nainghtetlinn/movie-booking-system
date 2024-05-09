import { DollarSign, Ticket } from "lucide-react"
import DatePickerWithRange from "@/components/DatePickerWithRange"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const Dashboard = () => {
  return (
    <>
      <section className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <DatePickerWithRange />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Sales</h3>
              <DollarSign className="h-6 w-6" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardTitle>1,545,500 Ks</CardTitle>
              <CardDescription className="text-xs">+20.1% from last month</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Tickets</h3>
              <Ticket className="h-6 w-6" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardTitle>500</CardTitle>
              <CardDescription className="text-xs">+20.1% from last month</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

export default Dashboard

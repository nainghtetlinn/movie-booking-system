import StaffsTable from "./StaffsTable"

import { fetchDashboardStaffs } from "@/server-actions/staff"
import { redirect } from "next/navigation"

const Staffs = async ({
  searchParams,
}: {
  searchParams: { filter?: "all" | "admin" | "staff" }
}) => {
  if (searchParams.filter && !["all", "admin", "staff"].includes(searchParams.filter))
    redirect("/dashboard/staffs")

  const staffs = await fetchDashboardStaffs(searchParams.filter || "all")

  return (
    <>
      <section className="p-4">
        <StaffsTable staffs={staffs} />
      </section>
    </>
  )
}

export default Staffs

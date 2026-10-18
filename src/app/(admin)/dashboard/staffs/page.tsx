import StaffsTable from "./StaffsTable"

import { fetchDashboardStaffs } from "@/server-actions/staff"
import { redirect } from "next/navigation"

const Staffs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "all" | "admin" | "staff" }>
}) => {
  const { filter } = await searchParams
  if (filter && !["all", "admin", "staff"].includes(filter)) redirect("/dashboard/staffs")

  const staffs = await fetchDashboardStaffs(filter || "all")

  return (
    <>
      <section className="p-4">
        <StaffsTable staffs={staffs} />
      </section>
    </>
  )
}

export default Staffs

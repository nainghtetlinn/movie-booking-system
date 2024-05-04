import StaffsTable from "./StaffsTable"

import db from "prisma/db"

const Staffs = async () => {
  const staffs = await db.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  })

  return (
    <>
      <section className="p-4">
        <StaffsTable staffs={staffs} />
      </section>
    </>
  )
}

export default Staffs

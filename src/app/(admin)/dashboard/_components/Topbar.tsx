"use client"

import DarkModeBtn from "@/components/DarkModeBtn"
import Profile from "@/components/Profile"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const Topbar = () => {
  const path = usePathname()
  const paths = path.split("/")
  paths.shift()

  return (
    <>
      <section className="flex items-center justify-between p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {paths.map((p, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {i + 1 !== paths.length ? (
                    <BreadcrumbLink asChild>
                      <Link href={`/${p}`}>{p}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{p}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i + 1 !== paths.length && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="hidden items-center space-x-4 sm:flex">
          <DarkModeBtn />
          <Profile />
        </div>
      </section>
    </>
  )
}

export default Topbar

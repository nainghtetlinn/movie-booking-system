"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

import { paid } from "@/server-actions/booking"
import { useState } from "react"
import { toast } from "sonner"

const PayBtn = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false)

  const pay = async () => {
    setLoading(true)
    try {
      await paid(id)
      toast.success("Success! Please check your email.")
    } catch (error) {
      toast.error("Something went wrong.")
    }
    setLoading(false)
  }

  return (
    <Button onClick={pay} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Fake Pay
    </Button>
  )
}

export default PayBtn

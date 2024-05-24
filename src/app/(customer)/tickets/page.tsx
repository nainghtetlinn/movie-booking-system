"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

import { listTicekts } from "@/server-actions/ticket"
import { TTickets } from "@/types/ticket"
import { ticketsSchema } from "@/validators/ticket"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const TicketsPage = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm<TTickets>({
    resolver: zodResolver(ticketsSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: TTickets) => {
    setLoading(true)
    try {
      await listTicekts(data.email)
      toast.success("Success! Please check your email.")
      form.reset()
    } catch (error) {
      toast.error("Something went wrong.")
    }
    setLoading(false)
  }

  return (
    <main className="container py-12">
      <Card className="mx-auto max-w-[600px]">
        <CardHeader>
          <CardTitle>List your bookings.</CardTitle>
          <CardDescription>
            The bookings list will be sent to the email you provided.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  )
}

export default TicketsPage

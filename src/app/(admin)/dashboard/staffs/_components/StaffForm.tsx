"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { TStaff } from "@/types/staff"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

const MovieForm = ({ form }: { form: UseFormReturn<TStaff> }) => {
  const [show, setShow] = useState<boolean>(false)

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type={show ? "text" : "password"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Checkbox id="showPassword" checked={show} onCheckedChange={() => setShow(!show)} />
          <label htmlFor="showPassword" className="select-none text-sm">
            Show password
          </label>
        </div>
      </Form>
    </>
  )
}

export default MovieForm

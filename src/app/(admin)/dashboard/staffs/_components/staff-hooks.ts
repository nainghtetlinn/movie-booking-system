import { TStaff } from "@/types/staff"
import { staffSchema } from "@/validators/staff"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, useForm } from "react-hook-form"

export const useStaffForm = (defaultValues?: DefaultValues<TStaff>) =>
  useForm<TStaff>({
    resolver: zodResolver(staffSchema),
    defaultValues: defaultValues ?? {},
  })

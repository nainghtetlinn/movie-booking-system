import { TStaff } from "@/types/staff"
import { staffSchema } from "@/validators/staff"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const useStaffForm = () =>
  useForm<TStaff>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

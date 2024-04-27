import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/validators/login"
import { TLogin } from "@/types/login"

export const useLoginForm = () => useForm<TLogin>({ resolver: zodResolver(loginSchema) })

import { Resend } from "resend"

const createResend = () => {
  return new Resend(process.env.RESEND_API_KEY!)
}

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined
}

const resend = globalForResend.resend ?? createResend()

export default resend

if (process.env.NODE_ENV !== "production") globalForResend.resend = resend

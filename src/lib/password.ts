import bcrypt from "bcrypt"

export const hashPassword = async (pw: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(pw, salt)
}

export const comparePassword = async (pw: string, hashedPw: string) => {
  return await bcrypt.compare(pw, hashedPw)
}

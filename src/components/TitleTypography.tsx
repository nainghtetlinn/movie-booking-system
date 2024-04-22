import { PropsWithChildren } from "react"

const TitleTypography = ({ children }: PropsWithChildren) => {
  return <h3 className="py-8 text-2xl font-bold text-primary md:text-3xl">{children}</h3>
}

export default TitleTypography

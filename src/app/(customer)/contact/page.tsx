import TitleTypography from "@/components/TitleTypography"
import { Button } from "@/components/ui/button"
import { Facebook, Github, Linkedin, Mail, Twitter } from "lucide-react"
import Link from "next/link"

const ContactPage = () => {
  return (
    <section className="container">
      <TitleTypography>Contact</TitleTypography>
      <div className="flex gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="mailto:naing.work.it@gmail.com">
            <Mail className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link target="_blank" href="https://github.com/nainghtetlinn">
            <Github className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link target="_blank" href="https://x.com/naingdev">
            <Twitter className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link target="_blank" href="https://www.facebook.com/naingdev">
            <Facebook className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="icon">
          <Link target="_blank" href="https://www.linkedin.com/in/naingdev">
            <Linkedin className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default ContactPage

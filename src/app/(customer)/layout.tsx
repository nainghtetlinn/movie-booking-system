import Nav from "./_components/Nav"

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <Nav />
      <main className="container py-2">{children}</main>
    </>
  )
}

export default Layout

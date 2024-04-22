import Nav from "./_components/Nav"

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  )
}

export default Layout

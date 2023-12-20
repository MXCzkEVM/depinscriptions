import { Layout } from "@/layout"
import { ReactElement } from "react"

function Page() {
  return <>131231</>
}

Page.layout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
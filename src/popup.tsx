import { MemoryRouter } from "react-router-dom"
import { Routing } from "~/routes"
import { sendToBackground } from "@plasmohq/messaging"
import "~/style.css"

// Example of how to fetch the scraped data from the background script, given that it exists
let funct = async () => {
const resp = await sendToBackground({
  name: "getScrapeData",
})
console.log("Response is ",resp)
}
 
funct();

function IndexPopup() {
  return (
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
  )
}

export default IndexPopup
import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getScrapedCourseData } from "../../background";
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await getScrapedCourseData();
  res.send(data)
  // res.send(null)
}
 
export default handler
import type { PlasmoMessaging } from "@plasmohq/messaging"
import {getScrapedCourseData} from "../index";
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = getScrapedCourseData();
 
  res.send({
    data
  })
}
 
export default handler
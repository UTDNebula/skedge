import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { CourseHeader, ShowCourseTabPayload } from ".../backgroundInterfaces";
import {getScrapedCourseData} from "../index";
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = getScrapedCourseData();
 
  res.send({
    data
  })
}
 
export default handler
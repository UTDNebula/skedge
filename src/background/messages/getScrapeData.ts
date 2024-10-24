import type { PlasmoMessaging } from '@plasmohq/messaging';

import { getScrapedCourseData } from '..';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await getScrapedCourseData();
  res.send(data);
};

export default handler;

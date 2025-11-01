import express from 'express';
import { Expo } from 'expo-server-sdk';
import prisma from "../config/prisma_config.js";

const router = express.Router();
const expo = new Expo();

// Send a push notification and store it in the database
router.post('/send/:home_id', async (req, res) => {
  const { title, body } = req.body;
  const { home_id } = req.params;

  try {
    // Fetch all users in the home
    const users = await prisma.user.findMany({
      where: { home_id },
    });
    console.log(users)
    // Filter valid push tokens
    const pushTokens = users
      .map((user) => user.pushToken)
      .filter((token) => Expo.isExpoPushToken(token));

    if (pushTokens.length === 0) {
      return res.status(400).json({ error: 'No valid push tokens found' });
    }

    // Prepare messages
const messages = pushTokens.map((pushToken) => ({
  to: pushToken,
  sound: 'default',
  title,
  body,
  priority: 'high',
  channelId: 'default', // Ensures notification displays properly
  data: { home_id }, // You can add extra data if needed
}));


    // Send notifications
    const tickets = await expo.sendPushNotificationsAsync(messages);

    // Store the notification in the database
    await prisma.notification.create({
      data: {
        home_id,
        title,
        message: body,
        read: false,
      },
    });

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;

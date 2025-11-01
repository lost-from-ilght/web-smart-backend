import prisma from "../config/prisma_config.js";

const notificationController = {
  createNotification: async (req, res) => {
    try {
      const { home_id, message, title, } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { id: home_id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const notification = await prisma.notification.create({
        data: {
          home_id,
          title,
          message,
          read: false
        }
      });

      res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  },

  getUserNotifications: async (req, res) => {
    try {
        const { home_id } = req.params;

        // Fetch notifications sorted by createdAt (oldest first)
        const notifications = await prisma.notification.findMany({
            where: { home_id },
            orderBy: { createdAt: 'asc' }, // Change to 'asc' to get oldest first
        });

        console.log("Fetched notifications:", notifications); // Debugging

        if (notifications.length === 0) {
            return res.status(200).json([]); // No notifications
        }

        // Filter notifications based on 2-minute difference
        const filteredNotifications = [notifications[0]]; // Always include the first notification
        let lastNotificationTime = new Date(notifications[0].createdAt).getTime();

        for (let i = 1; i < notifications.length; i++) {
            const currentNotificationTime = new Date(notifications[i].createdAt).getTime();
            const timeDifference = (currentNotificationTime - lastNotificationTime) / 1000; // Convert to seconds

            if (timeDifference >= 30) { // Only include if 2 minutes apart
                filteredNotifications.push(notifications[i]);
                lastNotificationTime = currentNotificationTime; // Update last notification time
            }
        }
        // pick only 10 notifications
        filteredNotifications.reverse()

        if (filteredNotifications.length > 10) {
            filteredNotifications.length = 10;
        }
        res.status(200).json(filteredNotifications);

    } catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({ error: "Failed to get notifications" });
    }
},


  

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
      console.log(notification)
      res.status(200).json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.notification.delete({
        where: { id }
      });
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  }
};

export default notificationController;
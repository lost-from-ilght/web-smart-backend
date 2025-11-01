import prisma from "../config/prisma_config.js";

const tvController = {
  createTv: async (req, res) => {
    try {
      const { name, room_id, volume, channel, isOn } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.tv.create({
        data: { name, room_id, volume, channel, isOn }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create TV" });
    }
  },

  getTvs: async (req, res) => {
    try {
      const devices = await prisma.tv.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get TVs" });
    }
  },

  getTvById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.tv.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "TV not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get TV" });
    }
  },

  updateTv: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, volume, channel, isOn } = req.body;

      const device = await prisma.tv.update({
        where: { id },
        data: { name, volume, channel, isOn }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update TV" });
    }
  },

  deleteTv: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.tv.delete({
        where: { id }
      });
      res.json({ message: "TV deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete TV" });
    }
  }
};

export default tvController;
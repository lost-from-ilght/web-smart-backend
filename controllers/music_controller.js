import prisma from "../config/prisma_config.js";

const musicController = {
  createMusic: async (req, res) => {
    try {
      const { name, room_id, volume, playing, track } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.music.create({
        data: { name, room_id, volume, playing, track }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create music device" });
    }
  },

  getMusicDevices: async (req, res) => {
    try {
      const devices = await prisma.music.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get music devices" });
    }
  },

  getMusicDeviceById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.music.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Music device not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get music device" });
    }
  },

  updateMusicDevice: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, volume, playing, track } = req.body;

      const device = await prisma.music.update({
        where: { id },
        data: { name, volume, playing, track }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update music device" });
    }
  },

  deleteMusicDevice: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.music.delete({
        where: { id }
      });
      res.json({ message: "Music device deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete music device" });
    }
  }
};

export default musicController;
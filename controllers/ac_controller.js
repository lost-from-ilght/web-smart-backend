import prisma from "../config/prisma_config.js";

const acController = {
  createAc: async (req, res) => {
    try {
      const { name, room_id, value } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.ac.create({
        data: { name, room_id, value }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create AC" });
    }
  },

  getAcs: async (req, res) => {
    try {
      const devices = await prisma.ac.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get ACs" });
    }
  },

  getAcById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.ac.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "AC not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get AC" });
    }
  },

  updateAc: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const device = await prisma.ac.update({
        where: { id },
        data: { name, value }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update AC" });
    }
  },

  deleteAc: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.ac.delete({
        where: { id }
      });
      res.json({ message: "AC deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete AC" });
    }
  }
};

export default acController;
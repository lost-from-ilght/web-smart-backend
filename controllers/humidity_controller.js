import prisma from "../config/prisma_config.js";

const humidityController = {
  createHumidity: async (req, res) => {
    try {
      const { name, room_id, value } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.humidity.create({
        data: { name, room_id, value }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create humidity sensor" });
    }
  },

  getHumidities: async (req, res) => {
    try {
      const devices = await prisma.humidity.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get humidity sensors" });
    }
  },

  getHumidityById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.humidity.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Humidity sensor not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get humidity sensor" });
    }
  },

  updateHumidity: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const device = await prisma.humidity.update({
        where: { id },
        data: { name, value }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update humidity sensor" });
    }
  },

  deleteHumidity: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.humidity.delete({
        where: { id }
      });
      res.json({ message: "Humidity sensor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete humidity sensor" });
    }
  }
};

export default humidityController;
import prisma from "../config/prisma_config.js";

const temperatureController = {
  createTemperature: async (req, res) => {
    try {
      const { name, room_id, value } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.temprature.create({
        data: { name, room_id, value }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create temperature sensor" });
    }
  },

  getTemperatures: async (req, res) => {
    try {
      const devices = await prisma.temprature.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get temperature sensors" });
    }
  },

  getTemperatureById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.temprature.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Temperature sensor not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get temperature sensor" });
    }
  },

  updateTemperature: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const device = await prisma.temprature.update({
        where: { id },
        data: { name, value }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update temperature sensor" });
    }
  },

  deleteTemperature: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.temprature.delete({
        where: { id }
      });
      res.json({ message: "Temperature sensor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete temperature sensor" });
    }
  }
};

export default temperatureController;
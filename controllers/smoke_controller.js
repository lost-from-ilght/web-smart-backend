import prisma from "../config/prisma_config.js";

const smokeController = {
  createSmoke: async (req, res) => {
    try {
      const {  room_id, value, alertLevel } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.smoke.create({
        data: {
          
          room_id,
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create smoke sensor" });
    }
  },

  getSmokeSensors: async (req, res) => {
    try {
      const devices = await prisma.smoke.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get smoke sensors" });
    }
  },

  getSmokeSensorById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.smoke.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Smoke sensor not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get smoke sensor" });
    }
  },

  updateSmokeSensor: async (req, res) => {
    try {
      const { id } = req.params;
      const {  value, alertLevel } = req.body;

      const device = await prisma.smoke.update({
        where: { id },
        data: {
          
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update smoke sensor" });
    }
  },

  deleteSmokeSensor: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.smoke.delete({
        where: { id }
      });
      res.json({ message: "Smoke sensor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete smoke sensor" });
    }
  }
};

export default smokeController;
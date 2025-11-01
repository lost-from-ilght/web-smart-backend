import prisma from "../config/prisma_config.js";

const fireController = {
  createFire: async (req, res) => {
    try {
      const { name, room_id, value, alertLevel } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.fire.create({
        data: {
          name,
          room_id,
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create fire sensor" });
    }
  },

  getFireSensors: async (req, res) => {
    try {
      const devices = await prisma.fire.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get fire sensors" });
    }
  },

  getFireSensorById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.fire.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Fire sensor not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get fire sensor" });
    }
  },

  updateFireSensor: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value, alertLevel } = req.body;

      const device = await prisma.fire.update({
        where: { id },
        data: {
          name,
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fire sensor" });
    }
  },

  deleteFireSensor: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.fire.delete({
        where: { id }
      });
      res.json({ message: "Fire sensor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fire sensor" });
    }
  }
};

export default fireController;
import prisma from "../config/prisma_config.js";

const gasController = {
  createGas: async (req, res) => {
    try {
      const {  room_id, value, alertLevel } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.gas.create({
        data: {
          
          room_id,
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create gas sensor" });
    }
  },

  getGasSensors: async (req, res) => {
    try {
      const devices = await prisma.gas.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gas sensors" });
    }
  },

  getGasSensorById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.gas.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Gas sensor not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get gas sensor" });
    }
  },

  updateGasSensor: async (req, res) => {
    try {
      const { id } = req.params;
      const {  value, alertLevel } = req.body;

      const device = await prisma.gas.update({
        where: { id },
        data: {
          
          value,
          alertLevel,
          alertTriggered: value > alertLevel
        }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update gas sensor" });
    }
  },

  deleteGasSensor: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.gas.delete({
        where: { id }
      });
      res.json({ message: "Gas sensor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gas sensor" });
    }
  }
};

export default gasController;
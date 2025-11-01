import prisma from "../config/prisma_config.js";

const switchController = {
  createSwitch: async (req, res) => {
    try {
      const { name, room_id, value, description } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.switch.create({
        data: { name, room_id, value, description }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create switch" });
    }
  },

  getSwitches: async (req, res) => {
    try {
      const switches = await prisma.switch.findMany({
        include: { room: true }
      });
      res.status(200).json(switches);
    } catch (error) {
      res.status(500).json({ error: "Failed to get switches" });
    }
  },

  getSwitchById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.switch.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "Switch not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get switch" });
    }
  },

  updateSwitch: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value, description } = req.body;

      const device = await prisma.switch.update({
        where: { id },
        data: { name, value, description }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update switch" });
    }
  },

  deleteSwitch: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.switch.delete({
        where: { id }
      });
      res.json({ message: "Switch deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete switch" });
    }
  }
};

export default switchController;
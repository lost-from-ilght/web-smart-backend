import prisma from "../config/prisma_config.js";

const onOffController = {
  createOnOff: async (req, res) => {
    try {
      const { name, room_id, value } = req.body;
      
      const room = await prisma.room.findUnique({
        where: { id: room_id }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const device = await prisma.onOff.create({
        data: { name, room_id, value }
      });
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create on/off device" });
    }
  },

  getOnOffs: async (req, res) => {
    try {
      const devices = await prisma.onOff.findMany({
        include: { room: true }
      });
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get on/off devices" });
    }
  },

  getOnOffById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = await prisma.onOff.findUnique({
        where: { id },
        include: { room: true }
      });
      
      if (!device) {
        return res.status(404).json({ error: "On/Off device not found" });
      }
      
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to get on/off device" });
    }
  },

  updateOnOff: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value } = req.body;

      const device = await prisma.onOff.update({
        where: { id },
        data: { name, value }
      });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to update on/off device" });
    }
  },

  deleteOnOff: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.onOff.delete({
        where: { id }
      });
      res.json({ message: "On/Off device deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete on/off device" });
    }
  }
};

export default onOffController;
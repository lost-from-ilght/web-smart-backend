import prisma from "../config/prisma_config.js";

const dangerController = {
  // Create a new Danger device
  createDanger: async (req, res) => {
    try {
      const { home_id, alert, sound } = req.body;
      console.log(home_id, alert, sound);
      // Check if the home exists
      const home = await prisma.home.findUnique({
        where: { id: home_id },
      });

      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }
      console.log(home);
      // Create the Danger device
      const danger = await prisma.danger.create({
        data: {
          home_id, alert, sound
        },
      });

      res.status(201).json(danger);
    } catch (error) {
      console.error("Error creating Danger device:", error);
      res.status(500).json({ error: "Failed to create Danger device" });
    }
  },

  // Get all Danger devices
  getAllDangers: async (req, res) => {
    try {
      const {id} = req.params

      const dangers = await prisma.danger.findMany({
        where:{home_id:id},
        include: { home: true }, // Include related home data
      });
      res.status(200).json(dangers);
    } catch (error) {
      console.error("Error fetching Danger devices:", error);
      res.status(500).json({ error: "Failed to fetch Danger devices" });
    }
  },

  // Get a single Danger device by ID
  getDangerById: async (req, res) => {
    try {
      const { id } = req.params;
      const danger = await prisma.danger.findUnique({
        where: { id },
        include: { home: true }, // Include related home data
      });

      if (!danger) {
        return res.status(404).json({ error: "Danger device not found" });
      }
      console.log(danger);
      res.status(200).json(danger);
    } catch (error) {
      console.error("Error fetching Danger device:", error);
      res.status(500).json({ error: "Failed to fetch Danger device" });
    }
  },

  // Update a Danger device
  updateDanger: async (req, res) => {
    try {
      const { id } = req.params;
      const { sound, alert } = req.body;
      const data = {}

      if (sound) {
        data.sound = sound;
      }
      if (alert) {
        data.alert = alert;
      }
      console.log(id);
      const danger = await prisma.danger.update({
        where: { id },
        data: data,
      });
      console.log(danger);
      res.status(200).json(danger);
    } catch (error) {
      console.error("Error updating Danger device:", error);
      res.status(500).json({ error: "Failed to update Danger device" });
    }
  },

  // Delete a Danger device
  deleteDanger: async (req, res) => {
    try {
      const { id } = req.params;
      
      const danger = await prisma.danger.findUnique({
        where: { id },
      });
  
      if (!danger) {
        return res.status(404).json({ error: "Danger device not found" });
      }
  
      // Remove the danger reference from the home (if needed)
  
      // Delete the Danger device
      await prisma.danger.delete({
        where: { id },
      });
  
      res.status(200).json({ message: "Danger device deleted successfully" });
    } catch (error) {
      console.error("Error deleting Danger device:", error);
      res.status(500).json({ error: "Failed to delete Danger device" });
    }
  },
  
};

export default dangerController;
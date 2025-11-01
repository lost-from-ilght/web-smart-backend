import prisma from "../config/prisma_config.js";

const homeController = {
  createhome: async (req, res) => {
    try {
      const { name, address, type } = req.body;
      console.log(name, address);
      // Check for existing home
      const existinghome = await prisma.home.findFirst({
        where: {
          name,
          address,
          type
        },
      });
      if (existinghome) {
        return res.status(400).json({ error: "home already exists" });
      }
  
      // Create the new home
      const home = await prisma.home.create({
        data: {
             name,
            address,
            type
        },
      });
  
      res.status(201).json(home); // Use 201 for created resource
    } catch (error) {
      console.error('Error creating home:', error);
      res.status(500).json({ error: "Failed to add home" });
    }
  },
  gethomes: async (req, res) => {
    try {
      // get all homes sorted by createdAt
      const homes = await prisma.home.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(homes);
    } catch (error) {
      console.error("Error retrieving homes:", error);
      res.status(500).json({ error: "faild to get homes" });
    }
  },
  gethomeById: async (req, res) => {
    try {
      const { id } = req.params;
      const home = await prisma.home.findUnique({ where: { id }, include:{
        users:true,
        rooms:{
          include: {
            switches: true,
            onoffs: true,
            gases: true,
            smokes: true,
            command: true,
            activities: true,
            divider: true
          },} ,
        danger:true
      } });

      if (!home) {
        return res.status(404).json({ error: "home not found" });
      }
      res.status(200).json(home);
    } catch (error) {
      console.error("Error retrieving home:", error);
      res.status(500).json({ error: "Failed to get the home" });
    }
  },
  updatehome: async (req, res) => {
    try {
      const {id} = req.params
      const { name, address } = req.body;

      const existinghome = await prisma.home.findUnique({
        where: { id },
      });

      if (!existinghome) {
        return res.status(404).json({ error: "home not found" });
      }

      const updatedhome = await prisma.home.update({
        where: { id },
        data: {
            name,
            address
          },
      });

      res.status(200).json(updatedhome);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update home" });
    }
  },
  deletehome: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.home.delete({
        where: { id },
      });
      res.json({ message: "home deleted successfully" });
    } catch (error) {
      console.error("Error deleting home:", error);
      res.status(500).json({ error: "Failed to delete home" });
    }
  },

  changeActivityOfHome: async (req, res) => {
    try {
      const { id } = req.params;
  
      const home = await prisma.home.findUnique({ where: { id } });
  
      if (!home) {
        return res.status(404).json({ error: "home not found" });
      }
  
      const updatedhome = await prisma.home.update({
        where: { id },
        data: {
          is_active: !home.is_active, // Toggle isActive
        },
      });
  
      res.status(200).json(updatedhome);
    } catch (error) {
      console.error(error);
    }
  },
};

export default homeController;

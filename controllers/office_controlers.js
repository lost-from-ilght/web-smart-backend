import prisma from "../config/prisma_config.js";

const officeController = {
  createoffice: async (req, res) => {
    try {
      const { name, address } = req.body;
      console.log(name, address);
      // Check for existing office
      const existingoffice = await prisma.office.findFirst({
        where: {
          name,
          address,
        },
      });
      if (existingoffice) {
        return res.status(400).json({ error: "office already exists" });
      }
  
      // Create the new office
      const office = await prisma.office.create({
        data: {
             name,
            address, 
        },
      });
  
      res.status(201).json(office); // Use 201 for created resource
    } catch (error) {
      console.error('Error creating office:', error);
      res.status(500).json({ error: "Failed to add office" });
    }
  },
  getoffices: async (req, res) => {
    try {
      // get all offices sorted by createdAt
      const offices = await prisma.office.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(offices);
    } catch (error) {
      console.error("Error retrieving offices:", error);
      res.status(500).json({ error: "faild to get offices" });
    }
  },
  getofficeById: async (req, res) => {
    try {
      const { id } = req.params;
      const office = await prisma.office.findUnique({ where: { id }, include:{
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

      if (!office) {
        return res.status(404).json({ error: "office not found" });
      }
      res.status(200).json(office);
    } catch (error) {
      console.error("Error retrieving office:", error);
      res.status(500).json({ error: "Failed to get the office" });
    }
  },
  updateoffice: async (req, res) => {
    try {
      const {id} = req.params
      const { name, address } = req.body;

      const existingoffice = await prisma.office.findUnique({
        where: { id },
      });

      if (!existingoffice) {
        return res.status(404).json({ error: "office not found" });
      }

      const updatedoffice = await prisma.office.update({
        where: { id },
        data: {
            name,
            address
          },
      });

      res.status(200).json(updatedoffice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update office" });
    }
  },
  deleteoffice: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.office.delete({
        where: { id },
      });
      res.json({ message: "office deleted successfully" });
    } catch (error) {
      console.error("Error deleting office:", error);
      res.status(500).json({ error: "Failed to delete office" });
    }
  },

  changeActivityOfoffice: async (req, res) => {
    try {
      const { id } = req.params;
  
      const office = await prisma.office.findUnique({ where: { id } });
  
      if (!office) {
        return res.status(404).json({ error: "office not found" });
      }
  
      const updatedoffice = await prisma.office.update({
        where: { id },
        data: {
          is_active: !office.is_active, // Toggle isActive
        },
      });
  
      res.status(200).json(updatedoffice);
    } catch (error) {
      console.error(error);
    }
  },
};

export default officeController;

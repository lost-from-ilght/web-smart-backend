import prisma from "../config/prisma_config.js";

const roomController = {
  createRoom: async (req, res) => {
    try {
      const { name, home_id } = req.body;
  
      const home = await prisma.home.findUnique({
        where: { id: home_id },
      });
  
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }
  
      const room = await prisma.room.create({
        data: {
          name,
          home: {
            connect: { id: home_id },
          },
        },
      });
  
      await prisma.command.create({ data: { room_id: room.id } });
      await prisma.activity.create({ data: { room_id: room.id } });
  
      const updatedRoom = await prisma.room.findUnique({
        where: { id: room.id },
        include: {
          switches: true,
          onoffs: true,
          acs: true,
          musics: true,
          tvs: true,
          home: true,
          gases: true,
          smokes: true,
          command: true,
          activities: true,
          divider: true,
        },
      });
  
      res.status(201).json(updatedRoom);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to add room" });
    }
  },

  getRooms: async (req, res) => {
    try {
      const {id} = req.params
      const rooms = await prisma.room.findMany({
        where:{
          home_id:id
        },
        include: {
          switches: true,
          onoffs: true,
          acs: true,
          // tempratures: true,
          // humidities: true,
          musics: true,
          tvs: true,
          home:true,
          gases: true,
          smokes: true,
         command: true,
         activities: true,
         divider: true
        }
      });
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Error retrieving rooms:", error);
      res.status(500).json({ error: "Failed to get rooms" });
    }
  },

  getRoomById: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await prisma.room.findUnique({
        where: { id },
        include: {
          switches: true,
          onoffs: true,
          acs: true,
          // tempratures: true,
          // humidities: true,
          musics: true,
          tvs: true,
          home:true,
          gases: true,
          smokes: true,
         command: true,
         activities: true,
         divider: true,
         buttons: true,
        }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.status(200).json(room);
    } catch (error) {
      console.error("Error retrieving room:", error);
      res.status(500).json({ error: "Failed to get the room" });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, home_id } = req.body;

      const existingRoom = await prisma.room.findUnique({
        where: { id }
      });

      if (!existingRoom) {
        return res.status(404).json({ error: "Room not found" });
      }

      const updatedRoom = await prisma.room.update({
        where: { id },
        data: { name, home_id }
      });

      res.status(200).json(updatedRoom);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update room" });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete related records first
      await prisma.command.deleteMany({ where: { room_id: id } });
      await prisma.activity.deleteMany({ where: { room_id: id } });
      await prisma.divider.deleteMany({ where: { room_id: id } });
      await prisma.switch.deleteMany({ where: { room_id: id } });
      await prisma.onOff.deleteMany({ where: { room_id: id } });
      await prisma.ac.deleteMany({ where: { room_id: id } });
      await prisma.music.deleteMany({ where: { room_id: id } });
      await prisma.tv.deleteMany({ where: { room_id: id } });
      await prisma.gas.deleteMany({ where: { room_id: id } });
      await prisma.smoke.deleteMany({ where: { room_id: id } });
  
      // Now delete the room
      await prisma.room.delete({
        where: { id }
      });
  
      res.json({ message: "Room and all related records deleted successfully" });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ error: "Failed to delete room" });
    }
  },
}

export default roomController;
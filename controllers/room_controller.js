import prisma from "../config/prisma_config.js";

const roomController = {
  createRoom: async (req, res) => {
    try {
      const { name, home_id } = req.body;
  
      // Validate required fields
      if (!name || !home_id) {
        return res.status(400).json({ error: "Name and home_id are required" });
      }
  
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
          home: true,
          command: true,
          activities: true,
        },
      });

      if (!updatedRoom) {
        return res.status(500).json({ error: "Failed to retrieve created room" });
      }
  
      res.status(201).json(updatedRoom);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to add room" });
    }
  },

  getRooms: async (req, res) => {
    try {
      const {id} = req.params
      
      // Validate that the home_id exists
      const home = await prisma.home.findUnique({
        where: { id }
      });
      
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }
      
      const rooms = await prisma.room.findMany({
        where:{
          home_id:id
        },
        include: {
         command: true,
         activities: true
        }
      });
      
      // Optimize response - only include necessary fields
      const optimizedRooms = rooms.map(room => {
        // Extract command without id and room_id
        let command = null;
        if (room.command) {
          const { id: cmdId, room_id: cmdRoomId, ...cmdFields } = room.command;
          command = cmdFields;
        }
        
        // Extract activities without id and room_id
        let activities = {};
        if (room.activities) {
          const { id: actId, room_id: actRoomId, ...actFields } = room.activities;
          activities = actFields;
        }
        
        return {
          id: room.id,
          name: room.name,
          command: command,
          activities: activities,
        };
      });
      
      res.status(200).json(optimizedRooms);
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
         command: true,
         activities: true,
        }
      });

      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      
      // Optimize response - only include necessary fields
      // Extract command without id and room_id
      let command = null;
      if (room.command) {
        const { id: cmdId, room_id: cmdRoomId, ...cmdFields } = room.command;
        command = cmdFields;
      }
      
      // Extract activities without id and room_id
      let activities = {};
      if (room.activities) {
        const { id: actId, room_id: actRoomId, ...actFields } = room.activities;
        activities = actFields;
      }
      
      const optimizedRoom = {
        id: room.id,
        name: room.name,
        command: command,
        activities: activities,
      };
      
      res.status(200).json(optimizedRoom);
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
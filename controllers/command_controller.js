import prisma from "../config/prisma_config.js";
import { sendPushNotification } from "../utils/send_notfication.js";

const commandController = {
  // Switch Controller Methods

  sendCommands: async (req, res) => {
    try {
      
      const { id } = req.params;
      const {
        masterBathLight,
        stove,
        oven, 
        freezer,
        fan,
        centerLight,
        spotLight,
        shadowLight,
        diningLight,
        colliderLight,
        stove1,
        stove2,
        strippeLight,
        diningStrippeLight,
      } = req.body;
      
      const command = await prisma.command.findUnique({
        where: { room_id: id },
        include:{room: {include: {home: true}}}
      });
  
      if (!command) {
        return res.status(404).json({ message: 'Command not found for this room' });
      }
  
      const updatedCommand = await prisma.command.update({
        where: { room_id: id },
        data: {
          masterBathLight: masterBathLight !== undefined ? masterBathLight : command.masterBathLight,
          stove: stove !== undefined ? stove : command.stove,
          oven: oven !== undefined ? oven : command.oven, 
          freezer: freezer !== undefined ? freezer : command.freezer,
          fan: fan !== undefined ? fan : command.fan,
          centerLight: centerLight !== undefined ? centerLight : command.centerLight,
          spotLight: spotLight !== undefined ? spotLight : command.spotLight,
          shadowLight: shadowLight !== undefined ? shadowLight : command.shadowLight,
          diningLight: diningLight !== undefined ? diningLight : command.diningLight,
          colliderLight: colliderLight !== undefined ? colliderLight : command.colliderLight,
          stove1: stove1 !== undefined ? stove1 : command.stove1,
          stove2: stove2 !== undefined ? stove2 : command.stove2,
          strippeLight: strippeLight !== undefined ? strippeLight : command.strippeLight,
          diningStrippeLight: diningStrippeLight !== undefined ? diningStrippeLight : command.diningStrippeLight,
        },
      });
  
      res.json(updatedCommand);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send commands' });
    }
  },
}

export default commandController;

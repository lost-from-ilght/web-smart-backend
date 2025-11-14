import prisma from "../config/prisma_config.js";

const activityController = {
  // Switch Controller Methods
  sendActivity: async (req, res) => { 
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
  
      // Build the update object dynamically - only include fields that exist in the Activity model
      const updateData = {};
      
      if (masterBathLight !== undefined) updateData.masterBathLight = masterBathLight;
      if (stove !== undefined) updateData.stove = stove;
      if (oven !== undefined) updateData.oven = oven;
      if (freezer !== undefined) updateData.freezer = freezer;
      if (fan !== undefined) updateData.fan = fan;
      if (centerLight !== undefined) updateData.centerLight = centerLight;
      if (spotLight !== undefined) updateData.spotLight = spotLight;
      if (shadowLight !== undefined) updateData.shadowLight = shadowLight;
      if (diningLight !== undefined) updateData.diningLight = diningLight;
      if (colliderLight !== undefined) updateData.colliderLight = colliderLight;
      if (stove1 !== undefined) updateData.stove1 = stove1;
      if (stove2 !== undefined) updateData.stove2 = stove2;
      if (strippeLight !== undefined) updateData.strippeLight = strippeLight;
      if (diningStrippeLight !== undefined) updateData.diningStrippeLight = diningStrippeLight;
  
      const updatedActivity = await prisma.activity.update({
        where: { room_id: id },
        data: updateData,
      });
  
      res.json(updatedActivity);
    } catch (error) {
      console.error("Error in sendActivity:", error.message, error.stack);
      res.status(500).json({ error: "Failed to send activities" });
    }
  },
  

  checkActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const home = await prisma.home.findUnique({
        where: { id },
      });
      
      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }
      
      res.json(home.is_active);
    } catch (error) {
      console.error("Error in checkActivity:", error.message, error.stack);
      res.status(500).json({ error: "Failed to check activity" });
    }
  },
  

};

export default activityController;

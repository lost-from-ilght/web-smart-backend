import prisma from "../config/prisma_config.js";

const activityController = {
  // Switch Controller Methods
  sendActivity: async (req, res) => { 
    try {
      const { id } = req.params;
      const {
        mainLight,
        sideLight,
        ac,
        music,
        leftHeadLight,
        rightHeadLight,
        goldLight,
        whiteLight,
        tv,
        frontSideLights,
        backSideLights,
        wallLights,
        storRoomLight,
        door,
        smartCurtain,
        charger,
        tempratureSensor,
        humidities,
        gases,
        smokes,
        rainSensors,
        motionDetector,
        waterFlowSensor,
        humiditySensor,
        depthSensor,
        soilmoistureSensor,
        waterTanker,
        plantWateringPump,
        stove,
        oven, 
        freezer,
        fan,
      } = req.body;
  
      if (req.body.hasOwnProperty("divider")) {
        if (req.body.divider) {
          console.log("Creating a new divider for room:", id);
          await prisma.divider.create({
            data: {
              room_id: id,
              plug_1: "off",
              plug_2: "off",
              plug_3: "off",
              plug_4: "off",
              plug_5: "off",
              plug_6: "off",
              plug_7: "off",
              plug_8: "off",
            },
          });
        } else {
          const dividerToDelete = await prisma.divider.findUnique({
            where: { room_id: id },
          });
  
          if (dividerToDelete) {
            console.log("Deleting divider:", dividerToDelete.id);
            await prisma.divider.delete({
              where: { id: dividerToDelete.id },
            });
          } else {
            console.log("No divider found for this room.");
          }
        }
      }
  
      // Build the update object dynamically
      const updateData = {
        mainLight,
        sideLight,
        ac,
        music,
        leftHeadLight,
        rightHeadLight,
        goldLight,
        whiteLight,
        tv,
        charger,
        frontSideLights,
        backSideLights,
        wallLights,
        storRoomLight,
        door,
        smartCurtain,
        tempratureSensor,
        humidities,
        gases,
        smokes,
        rainSensors,
        motionDetector,
        waterFlowSensor,
        humiditySensor,
        depthSensor,
        soilmoistureSensor,
        waterTanker,
        plantWateringPump,
        stove,
        oven, 
        freezer,
        fan,
      };
  
      if (req.body.hasOwnProperty("divider")) {
        updateData.divider = req.body.divider;
      }
  
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
      const activity = await prisma.home.findUnique({
        where: { id },
      });
      res.json(activity.is_active);
    } catch (error) {
      console.error("Error in checkActivity:", error.message, error.stack);
      res.status(500).json({ error: "Failed to check activity" });
    }
  },
  

};

export default activityController;

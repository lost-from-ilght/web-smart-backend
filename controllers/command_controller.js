import prisma from "../config/prisma_config.js";
import { sendPushNotification } from "../utils/send_notfication.js";

const commandController = {
  // Switch Controller Methods

  sendCommands: async (req, res) => {
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
        dangerFence,
        storRoomLight,
        door,
        smartCurtain,
        tempratureSensor,
        humidtySensor,
        gases,
        smokes,
        rainSensors,
        motionDetector,
        waterFlowSensor,
        // humiditySensor,
        divider,
        depthSensor,
        soilmoistureSensor,
        waterTanker,
        plantWateringPump,
        stove ,
        oven , 
        freezer ,
        fan ,
        charger,
        centerLight,
        spotLight,
        shadowLight,
        diningLight,
        colliderLight,
        stove1,
        stove2,
      } = req.body;
      if(soilmoistureSensor){
        console.log("soilmoistureSensor: " + soilmoistureSensor)
      }
      const command = await prisma.command.findUnique({
        where: { room_id: id },
        include:{room: true}
      });
  
      if (!command) {
        return res.status(404).json({ message: 'Command not found for this room' });
      }
  
      // Handle divider plugs dynamically
      const dividerData = command.divider || {};
      if (divider) {
        Object.keys(divider).forEach((plugKey) => {
          if (plugKey.startsWith('plug_')) {
            dividerData[plugKey] = divider[plugKey] || dividerData[plugKey];
          }
        });
      }
  
      const updatedCommand = await prisma.command.update({
        where: { room_id: id },
        data: {
          mainLight: mainLight || command.mainLight,
          sideLight: sideLight || command.sideLight,
          ac: ac || command.ac,
          music: music || command.music,
          leftHeadLight: leftHeadLight || command.leftHeadLight,
          rightHeadLight: rightHeadLight || command.rightHeadLight,
          goldLight: goldLight || command.goldLight,
          whiteLight: whiteLight || command.whiteLight,
          tv: tv || command.tv,
          frontSideLights: frontSideLights || command.frontSideLights,
          backSideLights: backSideLights || command.backSideLights,
          wallLights: wallLights || command.wallLights,
          dangerFence: dangerFence || command.dangerFence,
          storRoomLight: storRoomLight || command.storRoomLight,
          door: door || command.door,
          smartCurtain: smartCurtain || command.smartCurtain,
          tempratureSensor: tempratureSensor || command.tempratureSensor,
          // humidtySensor: humidtySensor || command.humidtySensor,
          gases: gases || command.gases,
          smokes: smokes || command.smokes,
          rainSensors: rainSensors || command.rainSensors,
          motionDetector: motionDetector || command.motionDetector,
          waterFlowSensor: waterFlowSensor || command.waterFlowSensor,
          humidtySensor: humidtySensor || command.humidtySensor,
          plantWateringPump: plantWateringPump || command.plantWateringPump,
          stove: stove || command.stove,
          oven: oven || command.oven, 
          freezer: freezer || command.freezer,
          fan: fan || command.fan,
          depthSensor: depthSensor || command.depthSensor,
          soilmoistureSensor: soilmoistureSensor || command.soilmoistureSensor,

          waterTanker: waterTanker || command.waterTanker,
          charger: charger || command.charger,
          centerLight: centerLight || command.centerLight,
          spotLight: spotLight || command.spotLight,
          shadowLight: shadowLight || command.shadowLight,
          diningLight: diningLight || command.diningLight,
          colliderLight: colliderLight || command.colliderLight,
          stove1: stove1 || command.stove1,
          stove2: stove2 || command.stove2,
        },
      });
  
      // Send notifications based on sensor data
      const users = await prisma.user.findMany({
        where: { home_id: updatedCommand.home_id }, // Assuming `home_id` is associated with the command
      });
  
      // Check for rain and send notification
      if (rainSensors === 'raining') {
        users.forEach(async (user) => {
          if (user.pushToken) {
            await sendPushNotification(
              command.room.home_id, // home_id
              'Rain Alert', // Title
              'በአሁኑ ሰዓት በቤትዎ ዝናብ እየዘነበ ነው Now it is raining at your house.', // Body
              user.pushToken // Push token
            );
          }
        });
      }
  
      // Check for soil moisture and send notification
      if (humidtySensor < 30) { // Example threshold for dry soil
        users.forEach(async (user) => {
          if (user.pushToken) {
            await sendPushNotification(
              command.room.home_id, // home_id
              'Plant Watering Alert', // Title
              'አትክልቶችዎ ውሃ ስላነሳቸው እባክዎ ውሃ ያጧቸው Please water the plants', // Body
              user.pushToken // Push token
            );
          }
        });
      }
  
      res.json(updatedCommand);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send commands' });
    }
  },
  sendCommandsToDivider: async (req, res) => {

    try {
      const { id } = req.params;
      const { divider } = req.body;
      console.log(id, divider);
  
      const command = await prisma.divider.findUnique({
        where: { room_id: id },
      });
  
      if (!command) {
        return res.status(404).json({ message: "divider not found for this room" });
      }
  
      const updatedCommand = await prisma.divider.update({
        where: { room_id: id },
        data: divider || command.divider,
      });
  
      res.json(updatedCommand);

} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to send divider commands" });
}
}
}

export default commandController;

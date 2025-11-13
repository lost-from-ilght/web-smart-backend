import prisma from "../config/prisma_config.js";

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // First, create a default home with the expected ID
    const EXPECTED_HOME_ID = "d4a172af-579a-4cd8-80e3-1ec875ad71c1";
    
    let home = await prisma.home.findUnique({
      where: { id: EXPECTED_HOME_ID }
    });
    
    if (!home) {
      home = await prisma.home.create({
        data: {
          id: EXPECTED_HOME_ID,
          name: "Smart Home",
          address: "123 Smart Street, Tech City",
          is_active: true,
          type: "home"
        }
      });
    }
    console.log('✅ Home created:', home.name, `(ID: ${home.id})`);

    // Define all rooms
    const rooms = [
      "Living Room",
      "Kitchen", 
      "Bath Room",
      "Outdoor",
      "Store",
      "Master Bed Room",
      "2nd Bed Room",
      "3rd Bed Room",
      "4th Bed room"
    ];

    // Create all rooms
    const createdRooms = [];
    for (const roomName of rooms) {
      let room = await prisma.room.findFirst({
        where: { 
          name: roomName,
          home_id: home.id
        }
      });
      
      if (!room) {
        room = await prisma.room.create({
          data: {
            name: roomName,
            home_id: home.id
          }
        });
      }
      createdRooms.push(room);
      console.log(`✅ Room created: ${roomName}`);
    }

    // Create Command and Activity records for each room
    for (const room of createdRooms) {
      // Create Command record
      await prisma.command.upsert({
        where: { room_id: room.id },
        update: {},
        create: {
          room_id: room.id,
          mainLight: "off",
          sideLight: "off",
          ac: 0,
          charger: "off",
          music: "off",
          leftHeadLight: "off",
          rightHeadLight: "off",
          goldLight: "off",
          whiteLight: "off",
          tv: "off",
          frontSideLights: "off",
          backSideLights: "off",
          wallLights: "off",
          dangerFence: "off",
          storRoomLight: "off",
          door: "unLock",
          smartCurtain: "open",
          tempratureSensor: 0,
          gases: "on",
          smokes: "on",
          rainSensors: "not Rainning",
          motionDetector: "not Detected",
          waterFlowSensor: 0,
          humidtySensor: 0,
          depthSensor: 0,
          soilmoistureSensor: 0,
          waterTanker: 0,
          plantWateringPump: "off",
          stove: "off",
          oven: "off",
          freezer: "off",
          fan: "off",
          centerLight: "off",
          spotLight: "off",
          shadowLight: "off",
          diningLight: "off",
          colliderLight: "off",
          stove1: "off",
          stove2: "off",
          strippeLight: "off",
          diningStrippeLight: "off"
        }
      });

      // Create Activity record
      await prisma.activity.upsert({
        where: { room_id: room.id },
        update: {},
        create: {
          room_id: room.id,
          mainLight: false,
          sideLight: false,
          ac: false,
          charger: false,
          music: false,
          leftHeadLight: false,
          rightHeadLight: false,
          goldLight: false,
          whiteLight: false,
          tv: false,
          frontSideLights: false,
          backSideLights: false,
          wallLights: false,
          dangerFence: false,
          storRoomLight: false,
          door: false,
          smartCurtain: false,
          tempratureSensor: false,
          gases: false,
          smokes: false,
          humiditySensor: false,
          rainSensors: false,
          motionDetector: false,
          waterFlowSensor: false,
          divider: false,
          depthSensor: false,
          soilmoistureSensor: false,
          waterTanker: false,
          plantWateringPump: false,
          stove: false,
          oven: false,
          freezer: false,
          fan: false,
          centerLight: false,
          spotLight: false,
          shadowLight: false,
          diningLight: false,
          colliderLight: false,
          stove1: false,
          stove2: false,
          strippeLight: false,
          diningStrippeLight: false
        }
      });

      // Create Divider record
      await prisma.divider.upsert({
        where: { room_id: room.id },
        update: {},
        create: {
          room_id: room.id,
          plug_1: "off",
          plug_2: "off",
          plug_3: "off",
          plug_4: "off",
          plug_5: "off",
          plug_6: "off",
          plug_7: "off",
          plug_8: "off"
        }
      });

      console.log(`✅ Command, Activity, and Divider records created for ${room.name}`);
    }

    // Create Danger record for the home
    await prisma.danger.upsert({
      where: { home_id: home.id },
      update: {},
      create: {
        home_id: home.id,
        sound: "on",
        alert: "off"
      }
    });
    console.log('✅ Danger record created for home');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - 1 Home created`);
    console.log(`   - ${rooms.length} Rooms created`);
    console.log(`   - ${rooms.length} Command records created`);
    console.log(`   - ${rooms.length} Activity records created`);
    console.log(`   - ${rooms.length} Divider records created`);
    console.log(`   - 1 Danger record created`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedDatabase()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });



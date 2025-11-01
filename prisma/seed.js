import prisma from "../config/prisma_config.js";

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // First, create a default home
    let home = await prisma.home.findFirst({
      where: { name: "Smart Home" }
    });
    
    if (!home) {
      home = await prisma.home.create({
        data: {
          name: "Smart Home",
          address: "123 Smart Street, Tech City",
          is_active: true,
          type: "home"
        }
      });
    }
    console.log('✅ Home created:', home.name);

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

    // Define devices and their room assignments
    const deviceAssignments = [
      // Living Room devices
      { name: "Center light", room: "Living Room", type: "switch", value: 0 },
      { name: "Spot light", room: "Living Room", type: "switch", value: 0 },
      { name: "Shadow light", room: "Living Room", type: "switch", value: 0 },
      
      // Kitchen devices
      { name: "Dining light", room: "Kitchen", type: "switch", value: 0 },
      { name: "Collider light", room: "Kitchen", type: "switch", value: 0 },
      { name: "Washing machine", room: "Kitchen", type: "onoff", value: false },
      { name: "Stove 1", room: "Kitchen", type: "onoff", value: false },
      { name: "Stove 2", room: "Kitchen", type: "onoff", value: false },
      
      // Bath Room devices
      { name: "Sucker fan", room: "Bath Room", type: "onoff", value: false },
      
      // Outdoor devices
      { name: "Outdoor light", room: "Outdoor", type: "switch", value: 0 },
      
      // Store devices
      { name: "Store light", room: "Store", type: "switch", value: 0 },
      
      // Bedroom devices (each bedroom gets basic lighting)
      { name: "Master Bed light", room: "Master Bed Room", type: "switch", value: 0 },
      { name: "2nd Bed light", room: "2nd Bed Room", type: "switch", value: 0 },
      { name: "3rd Bed light", room: "3rd Bed Room", type: "switch", value: 0 },
      { name: "4th Bed light", room: "4th Bed room", type: "switch", value: 0 }
    ];

    // Create devices
    for (const device of deviceAssignments) {
      const room = createdRooms.find(r => r.name === device.room);
      
      if (device.type === "switch") {
        let existingSwitch = await prisma.switch.findFirst({
          where: {
            name: device.name,
            room_id: room.id
          }
        });
        
        if (!existingSwitch) {
          await prisma.switch.create({
            data: {
              name: device.name,
              room_id: room.id,
              value: device.value,
              description: `Smart ${device.name} in ${device.room}`
            }
          });
        }
      } else if (device.type === "onoff") {
        let existingOnOff = await prisma.onOff.findFirst({
          where: {
            name: device.name,
            room_id: room.id
          }
        });
        
        if (!existingOnOff) {
          await prisma.onOff.create({
            data: {
              name: device.name,
              room_id: room.id,
              value: device.value
            }
          });
        }
      }
      console.log(`✅ Device created: ${device.name} in ${device.room}`);
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
          fan: "off"
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
          fan: false
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
    console.log(`   - ${deviceAssignments.length} Devices created`);
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



import prisma from "../config/prisma_config.js";

async function deleteAllData() {
  try {
    console.log('🗑️  Starting database cleanup...');

    // Delete in order to respect foreign key constraints
    
    // 1. Delete records that reference Room
    console.log('Deleting Buttons...');
    const buttons = await prisma.button.deleteMany({});
    console.log(`   ✅ Deleted ${buttons.count} buttons`);

    console.log('Deleting Commands...');
    const commands = await prisma.command.deleteMany({});
    console.log(`   ✅ Deleted ${commands.count} commands`);

    console.log('Deleting Activities...');
    const activities = await prisma.activity.deleteMany({});
    console.log(`   ✅ Deleted ${activities.count} activities`);

    console.log('Deleting Dividers...');
    const dividers = await prisma.divider.deleteMany({});
    console.log(`   ✅ Deleted ${dividers.count} dividers`);

    console.log('Deleting Switches...');
    const switches = await prisma.switch.deleteMany({});
    console.log(`   ✅ Deleted ${switches.count} switches`);

    console.log('Deleting OnOffs...');
    const onoffs = await prisma.onOff.deleteMany({});
    console.log(`   ✅ Deleted ${onoffs.count} onoffs`);

    console.log('Deleting ACs...');
    const acs = await prisma.ac.deleteMany({});
    console.log(`   ✅ Deleted ${acs.count} ACs`);

    console.log('Deleting Musics...');
    const musics = await prisma.music.deleteMany({});
    console.log(`   ✅ Deleted ${musics.count} musics`);

    console.log('Deleting TVs...');
    const tvs = await prisma.tv.deleteMany({});
    console.log(`   ✅ Deleted ${tvs.count} TVs`);

    console.log('Deleting Gases...');
    const gases = await prisma.gas.deleteMany({});
    console.log(`   ✅ Deleted ${gases.count} gases`);

    console.log('Deleting Smokes...');
    const smokes = await prisma.smoke.deleteMany({});
    console.log(`   ✅ Deleted ${smokes.count} smokes`);

    // 2. Delete Rooms (references Home)
    console.log('Deleting Rooms...');
    const rooms = await prisma.room.deleteMany({});
    console.log(`   ✅ Deleted ${rooms.count} rooms`);

    // 3. Delete records that reference Home
    console.log('Deleting Notifications...');
    const notifications = await prisma.notification.deleteMany({});
    console.log(`   ✅ Deleted ${notifications.count} notifications`);

    console.log('Deleting Dangers...');
    const dangers = await prisma.danger.deleteMany({});
    console.log(`   ✅ Deleted ${dangers.count} dangers`);

    // 4. Delete Users (references Home)
    // console.log('Deleting Users...');
    // const users = await prisma.user.deleteMany({});
    // console.log(`   ✅ Deleted ${users.count} users`);

    // // 5. Delete Homes
    // console.log('Deleting Homes...');
    // const homes = await prisma.home.deleteMany({});
    // console.log(`   ✅ Deleted ${homes.count} homes`);

    // 6. Delete Offices
    console.log('Deleting Offices...');
    const offices = await prisma.office.deleteMany({});
    console.log(`   ✅ Deleted ${offices.count} offices`);

    console.log('✅ All data deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();

// "name":"provider operator",
// "id":"3",
// "phone_number":"11111",
// "username":"driver0",
// "farePerKm":122.0,
// "fixedPrice":990.0,
// "is_active":true,
// "availability":true,
// "rating":4.5,
// "driver_id":"17f33290-10bd-4a66-9cb0-6cbb42d2e5ed",
// "client_id":"11",
// "reviewId":"8387fdac-a1ae-43c2-8dee-6688abd06317",
// "pickup_location_id":"8c8cae53-398b-44ae-82a9-35a27e22c64f",
// "dropoff_location_id":"81f8966e-779a-4812-9c5b-9f263ed2e9a5",
// "reason":"too long of a wait time",
// "request_id":"e4812096-5486-43f4-9470-36f08247735e",
// "status":"CANCELLED"

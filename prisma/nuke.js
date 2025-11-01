import prisma from "../config/prisma_config.js";
async function deleteAllData() {
  try {
    // Replace "collectionName" with the name of your MongoDB collection


    const deleteResult = await prisma.office.deleteMany({
    
    });
    console.log(`Deleted ${deleteResult.length} records.`);

    console.log('All data deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
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

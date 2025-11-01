# Database Seeding Script

This directory contains scripts for managing the database schema and seeding data.

## Files

- `schema.prisma` - Prisma schema definition
- `seed.js` - Database seeding script
- `nuke.js` - Script to delete all data (use with caution)

## Seeding the Database

The seed script will create:

### 🏠 Home
- **Smart Home** - A default home with address "123 Smart Street, Tech City"

### 🏠 Rooms (9 total)
- Living Room
- Kitchen
- Bath Room
- Outdoor
- Store
- Master Bed Room
- 2nd Bed Room
- 3rd Bed Room
- 4th Bed room

### 💡 Devices (14 total)

#### Living Room
- Center light (Switch)
- Spot light (Switch)
- Shadow light (Switch)

#### Kitchen
- Dining light (Switch)
- Collider light (Switch)
- Washing machine (On/Off)
- Stove 1 (On/Off)
- Stove 2 (On/Off)

#### Bath Room
- Sucker fan (On/Off)

#### Other Rooms
- Outdoor light (Switch) - in Outdoor
- Store light (Switch) - in Store
- Master Bed light (Switch) - in Master Bed Room
- 2nd Bed light (Switch) - in 2nd Bed Room
- 3rd Bed light (Switch) - in 3rd Bed Room
- 4th Bed light (Switch) - in 4th Bed room

### 📊 Additional Records
- **Command records** - One for each room with default settings
- **Activity records** - One for each room with default activity states
- **Divider records** - One for each room with 8 plug controls
- **Danger record** - One for the home with alert settings

## How to Run

### Prerequisites
Make sure you have:
1. Node.js installed
2. Dependencies installed: `npm install`
3. Database connection configured in `schema.prisma`

### Run the Seed Script
```bash
# From the backend-million directory
npm run seed
```

### Alternative (direct execution)
```bash
# From the backend-million directory
node prisma/seed.js
```

## What the Script Does

1. **Creates a default home** if it doesn't exist
2. **Creates all 9 rooms** associated with the home
3. **Creates all 14 devices** in their appropriate rooms
4. **Creates Command, Activity, and Divider records** for each room
5. **Creates a Danger record** for the home
6. **Uses upsert operations** to avoid duplicates (safe to run multiple times)

## Safety Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Upsert operations** - Won't create duplicates
- ✅ **Error handling** - Proper error messages and cleanup
- ✅ **Detailed logging** - Shows progress and summary

## Troubleshooting

If you encounter errors:

1. **Database connection issues**: Check your `schema.prisma` database URL
2. **Permission errors**: Ensure your database user has CREATE/INSERT permissions
3. **Schema mismatches**: Run `npx prisma generate` to update the Prisma client

## Cleaning the Database

⚠️ **Warning**: This will delete ALL data!

```bash
node prisma/nuke.js
```

Then run the seed script again to repopulate with fresh data.




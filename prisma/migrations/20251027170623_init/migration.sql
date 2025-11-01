-- CreateEnum
CREATE TYPE "Type" AS ENUM ('home', 'office');

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "home_id" TEXT NOT NULL,
    "pushToken" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Home" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "type" "Type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Office" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "home_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Switch" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Switch_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "OnOff" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnOff_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Ac" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ac_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "_id" TEXT NOT NULL,
    "home_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "office_id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Gas" (
    "_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "alertLevel" DOUBLE PRECISION NOT NULL,
    "alertTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gas_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Smoke" (
    "_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "alertLevel" DOUBLE PRECISION NOT NULL,
    "alertTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Smoke_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Music" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "playing" BOOLEAN NOT NULL,
    "track" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Tv" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "channel" TEXT NOT NULL,
    "isOn" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tv_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Command" (
    "_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "mainLight" TEXT NOT NULL DEFAULT 'off',
    "sideLight" TEXT NOT NULL DEFAULT 'off',
    "ac" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "charger" TEXT NOT NULL DEFAULT 'off',
    "music" TEXT NOT NULL DEFAULT 'off',
    "leftHeadLight" TEXT NOT NULL DEFAULT 'off',
    "rightHeadLight" TEXT NOT NULL DEFAULT 'off',
    "goldLight" TEXT NOT NULL DEFAULT 'off',
    "whiteLight" TEXT NOT NULL DEFAULT 'off',
    "tv" TEXT NOT NULL DEFAULT 'off',
    "frontSideLights" TEXT NOT NULL DEFAULT 'off',
    "backSideLights" TEXT NOT NULL DEFAULT 'off',
    "wallLights" TEXT NOT NULL DEFAULT 'off',
    "dangerFence" TEXT NOT NULL DEFAULT 'off',
    "storRoomLight" TEXT NOT NULL DEFAULT 'off',
    "door" TEXT NOT NULL DEFAULT 'unLock',
    "smartCurtain" TEXT NOT NULL DEFAULT 'open',
    "tempratureSensor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gases" TEXT NOT NULL DEFAULT 'on',
    "smokes" TEXT NOT NULL DEFAULT 'on',
    "rainSensors" TEXT NOT NULL DEFAULT 'not Rainning',
    "motionDetector" TEXT NOT NULL DEFAULT 'not Detected',
    "waterFlowSensor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "humidtySensor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depthSensor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "soilmoistureSensor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "waterTanker" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plantWateringPump" TEXT NOT NULL DEFAULT 'off',
    "stove" TEXT NOT NULL DEFAULT 'off',
    "oven" TEXT NOT NULL DEFAULT 'off',
    "freezer" TEXT NOT NULL DEFAULT 'off',
    "fan" TEXT NOT NULL DEFAULT 'off',

    CONSTRAINT "Command_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "mainLight" BOOLEAN NOT NULL DEFAULT false,
    "sideLight" BOOLEAN NOT NULL DEFAULT false,
    "ac" BOOLEAN NOT NULL DEFAULT false,
    "charger" BOOLEAN NOT NULL DEFAULT false,
    "music" BOOLEAN NOT NULL DEFAULT false,
    "leftHeadLight" BOOLEAN NOT NULL DEFAULT false,
    "rightHeadLight" BOOLEAN NOT NULL DEFAULT false,
    "goldLight" BOOLEAN NOT NULL DEFAULT false,
    "whiteLight" BOOLEAN NOT NULL DEFAULT false,
    "tv" BOOLEAN NOT NULL DEFAULT false,
    "frontSideLights" BOOLEAN NOT NULL DEFAULT false,
    "backSideLights" BOOLEAN NOT NULL DEFAULT false,
    "wallLights" BOOLEAN NOT NULL DEFAULT false,
    "dangerFence" BOOLEAN NOT NULL DEFAULT false,
    "storRoomLight" BOOLEAN NOT NULL DEFAULT false,
    "door" BOOLEAN NOT NULL DEFAULT false,
    "smartCurtain" BOOLEAN NOT NULL DEFAULT false,
    "tempratureSensor" BOOLEAN NOT NULL DEFAULT false,
    "gases" BOOLEAN NOT NULL DEFAULT false,
    "smokes" BOOLEAN NOT NULL DEFAULT false,
    "humiditySensor" BOOLEAN NOT NULL DEFAULT false,
    "rainSensors" BOOLEAN NOT NULL DEFAULT false,
    "motionDetector" BOOLEAN NOT NULL DEFAULT false,
    "waterFlowSensor" BOOLEAN NOT NULL DEFAULT false,
    "divider" BOOLEAN NOT NULL DEFAULT false,
    "depthSensor" BOOLEAN NOT NULL DEFAULT false,
    "soilmoistureSensor" BOOLEAN NOT NULL DEFAULT false,
    "waterTanker" BOOLEAN NOT NULL DEFAULT false,
    "plantWateringPump" BOOLEAN NOT NULL DEFAULT false,
    "stove" BOOLEAN NOT NULL DEFAULT false,
    "oven" BOOLEAN NOT NULL DEFAULT false,
    "freezer" BOOLEAN NOT NULL DEFAULT false,
    "fan" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Divider" (
    "_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "plug_1" TEXT NOT NULL DEFAULT 'off',
    "plug_2" TEXT NOT NULL DEFAULT 'off',
    "plug_3" TEXT NOT NULL DEFAULT 'off',
    "plug_4" TEXT NOT NULL DEFAULT 'off',
    "plug_5" TEXT NOT NULL DEFAULT 'off',
    "plug_6" TEXT NOT NULL DEFAULT 'off',
    "plug_7" TEXT NOT NULL DEFAULT 'off',
    "plug_8" TEXT NOT NULL DEFAULT 'off',

    CONSTRAINT "Divider_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Danger" (
    "_id" TEXT NOT NULL,
    "home_id" TEXT NOT NULL,
    "sound" TEXT NOT NULL DEFAULT 'on',
    "alert" TEXT NOT NULL DEFAULT 'off',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Danger_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Button" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Button_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Command_room_id_key" ON "Command"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_room_id_key" ON "Activity"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Divider_room_id_key" ON "Divider"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "Danger_home_id_key" ON "Danger"("home_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switch" ADD CONSTRAINT "Switch_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnOff" ADD CONSTRAINT "OnOff_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ac" ADD CONSTRAINT "Ac_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gas" ADD CONSTRAINT "Gas_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Smoke" ADD CONSTRAINT "Smoke_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tv" ADD CONSTRAINT "Tv_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Divider" ADD CONSTRAINT "Divider_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Danger" ADD CONSTRAINT "Danger_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Button" ADD CONSTRAINT "Button_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

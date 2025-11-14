import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma_config.js';

describe('Command API Tests', () => {
  let testHomeId;
  let testRoomId;
  let testCommandId;

  beforeAll(async () => {
    // Create a test home
    const home = await prisma.home.create({
      data: {
        name: 'Test Home for Commands',
        address: '123 Test Street',
        is_active: true,
        type: 'home',
      },
    });
    testHomeId = home.id;

    // Create a test room
    const room = await prisma.room.create({
      data: {
        name: 'Test Room for Commands',
        home_id: testHomeId,
      },
    });
    testRoomId = room.id;

    // Create a test command
    const command = await prisma.command.create({
      data: {
        room_id: testRoomId,
        masterBathLight: 'off',
        stove: 'off',
        oven: 'off',
        freezer: 'off',
        fan: 'off',
        centerLight: 'off',
        spotLight: 'off',
        shadowLight: 'off',
        diningLight: 'off',
        colliderLight: 'off',
        stove1: 'off',
        stove2: 'off',
        strippeLight: 'off',
        diningStrippeLight: 'off',
      },
    });
    testCommandId = command.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testCommandId) {
      await prisma.command.delete({ where: { id: testCommandId } });
    }
    if (testRoomId) {
      await prisma.activity.deleteMany({ where: { room_id: testRoomId } });
      await prisma.room.delete({ where: { id: testRoomId } });
    }
    if (testHomeId) {
      await prisma.home.delete({ where: { id: testHomeId } });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/commands/:id (sendCommands)', () => {
    it('should update command with valid fields', async () => {
      const response = await request(app)
        .post(`/api/commands/${testRoomId}`)
        .send({
          masterBathLight: 'on',
          stove: 'on',
          fan: 'on',
          centerLight: 'on',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('room_id', testRoomId);
      expect(response.body).toHaveProperty('masterBathLight', 'on');
      expect(response.body).toHaveProperty('stove', 'on');
      expect(response.body).toHaveProperty('fan', 'on');
      expect(response.body).toHaveProperty('centerLight', 'on');
    });

    it('should update all command fields', async () => {
      const response = await request(app)
        .post(`/api/commands/${testRoomId}`)
        .send({
          masterBathLight: 'off',
          stove: 'on',
          oven: 'on',
          freezer: 'on',
          fan: 'off',
          centerLight: 'on',
          spotLight: 'on',
          shadowLight: 'on',
          diningLight: 'on',
          colliderLight: 'on',
          stove1: 'on',
          stove2: 'on',
          strippeLight: 'on',
          diningStrippeLight: 'on',
        })
        .expect(200);

      expect(response.body.masterBathLight).toBe('off');
      expect(response.body.stove).toBe('on');
      expect(response.body.oven).toBe('on');
      expect(response.body.freezer).toBe('on');
      expect(response.body.fan).toBe('off');
      expect(response.body.centerLight).toBe('on');
      expect(response.body.spotLight).toBe('on');
      expect(response.body.shadowLight).toBe('on');
      expect(response.body.diningLight).toBe('on');
      expect(response.body.colliderLight).toBe('on');
      expect(response.body.stove1).toBe('on');
      expect(response.body.stove2).toBe('on');
      expect(response.body.strippeLight).toBe('on');
      expect(response.body.diningStrippeLight).toBe('on');
    });

    it('should return 404 if command does not exist for room', async () => {
      // Create a room without a command
      const roomWithoutCommand = await prisma.room.create({
        data: {
          name: 'Room Without Command',
          home_id: testHomeId,
        },
      });

      const response = await request(app)
        .post(`/api/commands/${roomWithoutCommand.id}`)
        .send({
          masterBathLight: 'on',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Command not found for this room');

      // Clean up
      await prisma.room.delete({ where: { id: roomWithoutCommand.id } });
    });

    it('should preserve existing values when fields are not provided', async () => {
      // First update with some values
      await request(app)
        .post(`/api/commands/${testRoomId}`)
        .send({
          masterBathLight: 'on',
          stove: 'on',
        })
        .expect(200);

      // Update with only one field
      const response = await request(app)
        .post(`/api/commands/${testRoomId}`)
        .send({
          fan: 'on',
        })
        .expect(200);

      // Should preserve previous values
      expect(response.body.masterBathLight).toBe('on');
      expect(response.body.stove).toBe('on');
      expect(response.body.fan).toBe('on');
    });
  });
});


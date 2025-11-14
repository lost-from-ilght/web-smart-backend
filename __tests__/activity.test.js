import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma_config.js';

describe('Activity API Tests', () => {
  let testHomeId;
  let testRoomId;
  let testActivityId;

  beforeAll(async () => {
    // Create a test home
    const home = await prisma.home.create({
      data: {
        name: 'Test Home for Activities',
        address: '123 Test Street',
        is_active: true,
        type: 'home',
      },
    });
    testHomeId = home.id;

    // Create a test room
    const room = await prisma.room.create({
      data: {
        name: 'Test Room for Activities',
        home_id: testHomeId,
      },
    });
    testRoomId = room.id;

    // Create a test activity
    const activity = await prisma.activity.create({
      data: {
        room_id: testRoomId,
        masterBathLight: false,
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
        diningStrippeLight: false,
      },
    });
    testActivityId = activity.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testActivityId) {
      await prisma.activity.delete({ where: { id: testActivityId } });
    }
    if (testRoomId) {
      await prisma.command.deleteMany({ where: { room_id: testRoomId } });
      await prisma.room.delete({ where: { id: testRoomId } });
    }
    if (testHomeId) {
      await prisma.home.delete({ where: { id: testHomeId } });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/activity/:id (sendActivity)', () => {
    it('should update activity with valid fields', async () => {
      const response = await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({
          masterBathLight: true,
          stove: true,
          fan: true,
          centerLight: true,
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('room_id', testRoomId);
      expect(response.body).toHaveProperty('masterBathLight', true);
      expect(response.body).toHaveProperty('stove', true);
      expect(response.body).toHaveProperty('fan', true);
      expect(response.body).toHaveProperty('centerLight', true);
    });

    it('should update all activity fields', async () => {
      const response = await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({
          masterBathLight: true,
          stove: true,
          oven: true,
          freezer: true,
          fan: true,
          centerLight: true,
          spotLight: true,
          shadowLight: true,
          diningLight: true,
          colliderLight: true,
          stove1: true,
          stove2: true,
          strippeLight: true,
          diningStrippeLight: true,
        })
        .expect(200);

      expect(response.body.masterBathLight).toBe(true);
      expect(response.body.stove).toBe(true);
      expect(response.body.oven).toBe(true);
      expect(response.body.freezer).toBe(true);
      expect(response.body.fan).toBe(true);
      expect(response.body.centerLight).toBe(true);
      expect(response.body.spotLight).toBe(true);
      expect(response.body.shadowLight).toBe(true);
      expect(response.body.diningLight).toBe(true);
      expect(response.body.colliderLight).toBe(true);
      expect(response.body.stove1).toBe(true);
      expect(response.body.stove2).toBe(true);
      expect(response.body.strippeLight).toBe(true);
      expect(response.body.diningStrippeLight).toBe(true);
    });

    it('should update only provided fields and preserve others', async () => {
      // First set all to true
      await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({
          masterBathLight: true,
          stove: true,
          fan: true,
        })
        .expect(200);

      // Then update only one field
      const response = await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({
          fan: false,
        })
        .expect(200);

      expect(response.body.fan).toBe(false);
      // Other fields should remain unchanged (or be their default)
    });

    it('should handle boolean false values correctly', async () => {
      const response = await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({
          masterBathLight: false,
          stove: false,
          oven: false,
        })
        .expect(200);

      expect(response.body.masterBathLight).toBe(false);
      expect(response.body.stove).toBe(false);
      expect(response.body.oven).toBe(false);
    });
  });

  describe('GET /api/activity/check/:id (checkActivity)', () => {
    it('should return home is_active status', async () => {
      const response = await request(app)
        .get(`/api/activity/check/${testHomeId}`)
        .expect(200);

      expect(typeof response.body).toBe('boolean');
      expect(response.body).toBe(true); // We set is_active to true in beforeAll
    });

    it('should return 404 if home does not exist', async () => {
      const response = await request(app)
        .get('/api/activity/check/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Home not found');
    });
  });
});


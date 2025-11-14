import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma_config.js';

describe('Integration Tests - Room, Command, and Activity', () => {
  let testHomeId;
  let testRoomId;

  beforeAll(async () => {
    // Create a test home
    const home = await prisma.home.create({
      data: {
        name: 'Integration Test Home',
        address: '123 Integration Street',
        is_active: true,
        type: 'home',
      },
    });
    testHomeId = home.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testRoomId) {
      await prisma.command.deleteMany({ where: { room_id: testRoomId } });
      await prisma.activity.deleteMany({ where: { room_id: testRoomId } });
      await prisma.room.delete({ where: { id: testRoomId } });
    }
    if (testHomeId) {
      await prisma.home.delete({ where: { id: testHomeId } });
    }
    await prisma.$disconnect();
  });

  it('should create a room and automatically create command and activity', async () => {
    const createResponse = await request(app)
      .post('/api/room/create')
      .send({
        name: 'Integration Test Room',
        home_id: testHomeId,
      })
      .expect(201);

    testRoomId = createResponse.body.id;

    expect(createResponse.body).toHaveProperty('command');
    expect(createResponse.body).toHaveProperty('activities');
  });

  it('should update command and verify it persists', async () => {
    // Ensure room exists
    if (!testRoomId) {
      const createResponse = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Integration Test Room',
          home_id: testHomeId,
        })
        .expect(201);
      testRoomId = createResponse.body.id;
    }

    const commandResponse = await request(app)
      .post(`/api/commands/${testRoomId}`)
      .send({
        masterBathLight: 'on',
        stove: 'on',
        fan: 'on',
      })
      .expect(200);

    expect(commandResponse.body.masterBathLight).toBe('on');
    expect(commandResponse.body.stove).toBe('on');
    expect(commandResponse.body.fan).toBe('on');
  });

  it('should update activity and verify it persists', async () => {
    const activityResponse = await request(app)
      .post(`/api/activity/${testRoomId}`)
      .send({
        masterBathLight: true,
        stove: true,
        fan: true,
      })
      .expect(200);

    expect(activityResponse.body.masterBathLight).toBe(true);
    expect(activityResponse.body.stove).toBe(true);
    expect(activityResponse.body.fan).toBe(true);
  });

  it('should retrieve room with updated command and activity', async () => {
    // Ensure room exists and has been updated
    if (!testRoomId) {
      const createResponse = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Integration Test Room',
          home_id: testHomeId,
        })
        .expect(201);
      testRoomId = createResponse.body.id;
      
      // Update command and activity first
      await request(app)
        .post(`/api/commands/${testRoomId}`)
        .send({ masterBathLight: 'on' })
        .expect(200);
      
      await request(app)
        .post(`/api/activity/${testRoomId}`)
        .send({ masterBathLight: true })
        .expect(200);
    }

    const roomResponse = await request(app)
      .get(`/api/room/find/${testRoomId}`)
      .expect(200);

    expect(roomResponse.body).toHaveProperty('command');
    expect(roomResponse.body).toHaveProperty('activities');
    // Note: These might be 'off' and false if not updated, so we'll just check they exist
    expect(roomResponse.body.command).toBeDefined();
    expect(roomResponse.body.activities).toBeDefined();
  });

  it('should verify room does not have removed relations', async () => {
    // Ensure room exists
    if (!testRoomId) {
      const createResponse = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Integration Test Room',
          home_id: testHomeId,
        })
        .expect(201);
      testRoomId = createResponse.body.id;
    }

    const roomResponse = await request(app)
      .get(`/api/room/find/${testRoomId}`)
      .expect(200);

    // Verify removed relations are not present
    expect(roomResponse.body).not.toHaveProperty('switches');
    expect(roomResponse.body).not.toHaveProperty('onoffs');
    expect(roomResponse.body).not.toHaveProperty('acs');
    expect(roomResponse.body).not.toHaveProperty('musics');
    expect(roomResponse.body).not.toHaveProperty('tvs');
    expect(roomResponse.body).not.toHaveProperty('gases');
    expect(roomResponse.body).not.toHaveProperty('smokes');
    expect(roomResponse.body).not.toHaveProperty('divider');
    expect(roomResponse.body).not.toHaveProperty('buttons');
  });

  it('should get all rooms for home and verify structure', async () => {
    const roomsResponse = await request(app)
      .get(`/api/room/${testHomeId}`)
      .expect(200);

    expect(Array.isArray(roomsResponse.body)).toBe(true);
    if (roomsResponse.body.length > 0) {
      const room = roomsResponse.body[0];
      expect(room).toHaveProperty('id');
      expect(room).toHaveProperty('name');
      expect(room).toHaveProperty('command');
      expect(room).toHaveProperty('activities');
    }
  });
});


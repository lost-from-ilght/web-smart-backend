import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma_config.js';

describe('Room API Tests', () => {
  let testHomeId;
  let testRoomId;

  beforeAll(async () => {
    // Create a test home
    const home = await prisma.home.create({
      data: {
        name: 'Test Home',
        address: '123 Test Street',
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

  describe('POST /api/room/create', () => {
    it('should create a new room with command and activity', async () => {
      const response = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Test Room',
          home_id: testHomeId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Room');
      expect(response.body).toHaveProperty('command');
      expect(response.body).toHaveProperty('activities');
      expect(response.body).toHaveProperty('home');

      testRoomId = response.body.id;

      // Verify command was created
      expect(response.body.command).toBeDefined();
      
      // Verify activity was created
      expect(response.body.activities).toBeDefined();
    });

    it('should return 404 if home does not exist', async () => {
      const response = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Test Room 2',
          home_id: 'non-existent-id',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Home not found');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/room/create')
        .send({
          name: 'Test Room',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Name and home_id are required');
    });
  });

  describe('GET /api/room/:id (getRooms)', () => {
    beforeEach(async () => {
      // Ensure we have a room
      if (!testRoomId) {
        const room = await prisma.room.create({
          data: {
            name: 'Test Room for Get',
            home_id: testHomeId,
          },
        });
        await prisma.command.create({ data: { room_id: room.id } });
        await prisma.activity.create({ data: { room_id: room.id } });
        testRoomId = room.id;
      }
    });

    it('should get all rooms for a home', async () => {
      const response = await request(app)
        .get(`/api/room/${testHomeId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        const room = response.body[0];
        expect(room).toHaveProperty('id');
        expect(room).toHaveProperty('name');
        expect(room).toHaveProperty('command');
        expect(room).toHaveProperty('activities');
        // Should not have removed relations
        expect(room).not.toHaveProperty('switches');
        expect(room).not.toHaveProperty('onoffs');
        expect(room).not.toHaveProperty('acs');
      }
    });

    it('should return 404 if home does not exist', async () => {
      const response = await request(app)
        .get('/api/room/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Home not found');
    });
  });

  describe('GET /api/room/find/:id (getRoomById)', () => {
    it('should get a room by id', async () => {
      if (!testRoomId) {
        const room = await prisma.room.create({
          data: {
            name: 'Test Room for Find',
            home_id: testHomeId,
          },
        });
        await prisma.command.create({ data: { room_id: room.id } });
        await prisma.activity.create({ data: { room_id: room.id } });
        testRoomId = room.id;
      }

      const response = await request(app)
        .get(`/api/room/find/${testRoomId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testRoomId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('command');
      expect(response.body).toHaveProperty('activities');
      // Should not have removed relations
      expect(response.body).not.toHaveProperty('switches');
      expect(response.body).not.toHaveProperty('divider');
    });

    it('should return 404 if room does not exist', async () => {
      const response = await request(app)
        .get('/api/room/find/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });

  describe('PUT /api/room/:id (updateRoom)', () => {
    it('should update a room', async () => {
      if (!testRoomId) {
        const room = await prisma.room.create({
          data: {
            name: 'Test Room for Update',
            home_id: testHomeId,
          },
        });
        testRoomId = room.id;
      }

      const response = await request(app)
        .put(`/api/room/${testRoomId}`)
        .send({
          name: 'Updated Room Name',
          home_id: testHomeId,
        })
        .expect(200);

      expect(response.body).toHaveProperty('id', testRoomId);
      expect(response.body).toHaveProperty('name', 'Updated Room Name');
    });

    it('should return 404 if room does not exist', async () => {
      const response = await request(app)
        .put('/api/room/non-existent-id')
        .send({
          name: 'Updated Name',
          home_id: testHomeId,
        })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });

  describe('DELETE /api/room/:id (deleteRoom)', () => {
    it('should delete a room and its related records', async () => {
      // Create a room specifically for deletion
      const roomToDelete = await prisma.room.create({
        data: {
          name: 'Room to Delete',
          home_id: testHomeId,
        },
      });
      await prisma.command.create({ data: { room_id: roomToDelete.id } });
      await prisma.activity.create({ data: { room_id: roomToDelete.id } });

      const response = await request(app)
        .delete(`/api/room/${roomToDelete.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Room and all related records deleted successfully');

      // Verify room is deleted
      const deletedRoom = await prisma.room.findUnique({
        where: { id: roomToDelete.id },
      });
      expect(deletedRoom).toBeNull();

      // Verify command is deleted
      const deletedCommand = await prisma.command.findUnique({
        where: { room_id: roomToDelete.id },
      });
      expect(deletedCommand).toBeNull();

      // Verify activity is deleted
      const deletedActivity = await prisma.activity.findUnique({
        where: { room_id: roomToDelete.id },
      });
      expect(deletedActivity).toBeNull();
    });
  });
});


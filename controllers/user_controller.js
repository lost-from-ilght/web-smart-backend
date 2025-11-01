import prisma from "../config/prisma_config.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const secretKey = process.env.JWT_SECRET;
const saltRounds = 10;
const userController = {
  createUser: async (req, res) => {
    try {
      const { name, email, phone, password, home_id } = req.body;

      // Check if home exists
      const home = await prisma.home.findUnique({
        where: { id: home_id }
      });

      if (!home) {
        return res.status(404).json({ error: "Home not found" });
      }

      // Check if email already exists
      const existingUser = await prisma.user.findFirst({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password:hashedPassword, // Note: In a real application, this should be hashed
          home_id,
          // office_id: "yey boi"
        },
        include: {
          home: true,
        }
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: "Failed to create user" });
    }
  },

  getUsers: async (req, res) => {
    try {
      const {id} = req.params
      const users = await prisma.user.findMany({
        where:{home_id:id},
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          home_id: true,
          home: true,
          pushToken:true,
        }
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          home_id: true,
          home: true,
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  },

  getUsersByHome: async (req, res) => {
    try {
      const { home_id } = req.params;
      const users = await prisma.user.findMany({
        where: { home_id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          home_id: true,
        }
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users by home:", error);
      res.status(500).json({ error: "Failed to get users by home" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // If home_id is being updated, verify the new home exists

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          phone,

        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          home_id: true,
          home: true,
        }
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id }
      });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // In a real application, you would verify the current password here
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword // Note: In a real application, this should be hashed
        }
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Failed to update password" });
    }
  },
  updateUserToken: async (req, res) => {
    try {
      const { id } = req.params;
      const { pushToken } = req.body;

      // Check if user exists
      console.log("teteyeku" ,id, pushToken);
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
              pushToken
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  },
};

export default userController;
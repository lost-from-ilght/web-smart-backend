import prisma from "../config/prisma_config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // In production, always use environment variable

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "username and password are required" });
      }

      // Find user by username
      const user = await prisma.user.findFirst({
        where: { name: username }, 
        include: {home:{include:{danger:true}} }
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          name: user.username,
          homeId: user.home_id
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Send response
      console.log(userWithoutPassword)
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
};

export default authController;
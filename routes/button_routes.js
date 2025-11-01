import express from 'express';
import prisma from "../config/prisma_config.js";
const router = express.Router();

router.post('/', async (req, res) => {
    const { button_id, button } = req.body;
  
    try {
      // Update the button by ID
      const updatedButton = await prisma.button.update({
        where: { id: button_id || "53acd4a6-316d-4b3e-a1c5-eb023259ff2d" },
        data: { value: button }
      });
      
      res.json(updatedButton);
    } catch (error) {
      console.error('Error updating button:', error);
      res.status(500).json({ error: 'Failed to update button' });
    }
  });

  export default router;
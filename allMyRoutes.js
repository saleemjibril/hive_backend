import express from 'express';
const router = express.Router();
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import episodeRoutes from './routes/episodeRoutes.js'
import cloudinaryRoutes from './routes/cloudinaryRoutes.js'

router.use("/events",  eventRoutes);
router.use("/episode",  episodeRoutes);
router.use("/auth",  authRoutes);
router.use("/files",  cloudinaryRoutes);



export default router

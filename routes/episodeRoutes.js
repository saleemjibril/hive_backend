import express from 'express';
import { createEpisode } from '../controllers/episodeController.js';
import {protect} from '../controllers/authController.js';

const router = express.Router();

// router.route('/').put(protect, updateImage)
router.route('/').post(protect, createEpisode)

// router.put('/:id', updateGame)

// router.route('/').put(protect, updateGame)

// router.get('/', getAllGames)
// router.get('/:id', getGame)
// router.route('/:id').delete(protect, deleteGame)



export default router;

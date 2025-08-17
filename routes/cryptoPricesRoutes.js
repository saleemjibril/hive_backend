import express from 'express';
import { createEpisode } from '../controllers/episodeController.js';
import {protect} from '../controllers/authController.js';
import { getCryptoPrices } from '../controllers/cryptoPricesController.js';

const router = express.Router();

// router.route('/').put(protect, updateImage)
// router.route('/').get(protect, createEpisode)

// router.put('/:id', updateGame)

// router.route('/').put(protect, updateGame)

router.get('/', getCryptoPrices)
// router.get('/:id', getGame)
// router.route('/:id').delete(protect, deleteGame)



export default router;

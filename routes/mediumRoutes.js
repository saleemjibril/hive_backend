import express from 'express';
import { fetchMediumArticles } from '../controllers/mediumController.js';
const router = express.Router()

router.get('/', fetchMediumArticles)



export default router;

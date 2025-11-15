import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import verifikasiRouter from './routes/verifikasi.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'postgresql://postgres:lKPsexDsOTwrMLZWxgARMpObFIzJHUWU@metro.proxy.rlwy.net:46913/railway' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/verfikasi', verifikasiRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Backend running on port ${port}`));

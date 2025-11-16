import express from 'express';
import pool from '../db.js'; // default import

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nomorSurat, namaPegawai } = req.body;

    if (!nomorSurat || !namaPegawai) {
      return res.status(400).json({ verified: false, message: 'Nomor surat dan nama pegawai wajib diisi.' });
    }

    const query = `
      SELECT nomor_surat, nama_pegawai, nip, status_verifikasi
      FROM berkas_verifikasi
      WHERE nomor_surat = $1 AND LOWER(nama_pegawai) = LOWER($2)
      LIMIT 1
    `;
    const values = [nomorSurat.trim(), namaPegawai.trim()];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ verified: false, message: 'Data tidak ditemukan.' });
    }

    const row = rows[0];
    if (!row.status_verifikasi) {
      return res.json({ verified: false, message: 'Data ditemukan tetapi belum terverifikasi.' });
    }

    return res.json({
      verified: true,
      data: {
        nomor_surat: result.rows[0].nomor_surat,
        nama_pegawai: result.rows[0].nama,
        nip: result.rows[0].nip,
        jabatan: result.rows[0].jabatan,
        unit_kerja: result.rows[0].unit_kerja,
        tanggal_surat: result.rows[0].tanggal_surat,
        perihal: result.rows[0].perihal
      },
      message: 'Telah terverifikasi.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ verified: false, message: 'Server error.' });
  }
});

export default router;

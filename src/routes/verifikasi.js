import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { nomorSurat, namaPegawai } = req.body;

  try {
    // simpan hasil query ke variabel result
    const result = await pool.query(
      "SELECT * FROM berkas_verifikasi WHERE nomor_surat = $1 AND nama_pegawai = $2",
      [nomorSurat, namaPegawai]
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        verified: true,
        data: {
          nomor_surat: row.nomor_surat,
          nama_pegawai: row.nama_pegawai || row.nama, // sesuaikan dengan nama kolom di DB
          nip: row.nip,
          jabatan: row.jabatan,
          unit_kerja: row.unit_kerja,
          tanggal_surat: row.tanggal_surat,
          perihal: row.perihal
        },
        message: "Telah terverifikasi."
      });
    } else {
      res.json({ verified: false, message: "Data tidak ditemukan." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

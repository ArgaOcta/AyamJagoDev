const express = require("express");
const router = express.Router();

// middleware upload file (multer biasanya)
const upload = require("../middlewares/uploadMiddleware");

// koneksi database
const db = require("../config/db");

// route POST upload gambar
router.post("/", (req, res) => {

  // upload 1 file dengan field name = photo
  upload.single("photo")(req, res, (err) => {

    // kalau error upload
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    // kalau file kosong / tidak dikirim
    if (!req.file) {
      return res.status(400).json({
        message: "Tidak ada file diupload",
      });
    }

    // ambil vehicle_id dari body
    const vehicleId = req.body.vehicle_id;

    // validasi vehicle_id wajib ada
    if (!vehicleId) {
      return res.status(400).json({
        message: "vehicle_id wajib diisi",
      });
    }

    // query update nama file ke tabel vehicles
    const sql = "UPDATE vehicles SET image_url = ? WHERE id = ?";

    db.query(sql, [req.file.filename, vehicleId], (dbErr, result) => {

      // kalau query gagal
      if (dbErr) {
        return res.status(500).json({
          message: "Gagal update database",
          error: dbErr.message,
        });
      }

      // response sukses
      res.json({
        message: "Upload berhasil & gambar kendaraan diupdate",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      });
    });
  });
});

// export router
module.exports = router;
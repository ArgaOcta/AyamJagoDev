const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const db = require("../config/db");

router.post("/", (req, res) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Tidak ada file diupload",
      });
    }


    const vehicleId = req.body.vehicle_id;

    if (!vehicleId) {
      return res.status(400).json({
        message: "vehicle_id wajib diisi",
      });
    }


    const sql = "UPDATE vehicles SET image_url = ? WHERE id = ?";

    db.query(sql, [req.file.filename, vehicleId], (dbErr, result) => {
      if (dbErr) {
        return res.status(500).json({
          message: "Gagal update database",
          error: dbErr.message,
        });
      }

      res.json({
        message: "Upload berhasil & gambar kendaraan diupdate",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      });
    });
  });
});

module.exports = router;
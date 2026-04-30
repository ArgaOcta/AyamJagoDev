const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const db = require("../config/database");

router.post("/", (req, res) => {
  upload.single("photo")(req, res, async (err) => { 

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file diupload" });
    }

    const vehicleId = req.body.vehicle_id;
    if (!vehicleId) {
      return res.status(400).json({ message: "vehicle_id wajib diisi" });
    }

    try {
      const sql = "UPDATE vehicles SET image_url = ? WHERE id = ?";
      await db.query(sql, [req.file.filename, vehicleId]); 

      res.json({
        message: "Upload berhasil & gambar kendaraan diupdate",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      });
    } catch (dbErr) {
      console.error(dbErr);
      res.status(500).json({
        message: "Gagal update database",
        error: dbErr.message,
      });
    }
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Menghapus semua spasi dari nama file asli agar URL aman
    const cleanFileName = file.originalname.replace(/\s+/g, '-');
    cb(null, 'vehicle-' + Date.now() + '-' + cleanFileName);
  }
});

const upload = multer({ storage });

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);

router.post('/', upload.single('image'), vehicleController.createVehicle);
router.put('/:id', upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
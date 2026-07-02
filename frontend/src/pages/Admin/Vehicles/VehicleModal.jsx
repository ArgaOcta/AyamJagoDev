import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";
import { API_BASE_URL } from "../../../utils/api";
import styles from "./VehicleModal.module.css";

export default function VehicleModal({
  vehicle,
  closeModal,
  refresh,
}) {

  const isEdit = vehicle !== null;

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    brand: "",
    model: "",
    license_plate: "",
    category: "mobil",
    price_per_day: "",
    status: "tersedia",
    description: "",
    transmission: "manual",
    seat_capacity: 5,
    fuel_type: "bensin",
    luggage_capacity: 2,
    features: "",
    existing_image: ""
  });

  useEffect(() => {

    if (vehicle) {

      setForm({
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        license_plate: vehicle.license_plate || "",
        category: vehicle.category || "mobil",
        price_per_day: vehicle.price_per_day || "",
        status: vehicle.status || "tersedia",
        description: vehicle.description || "",
        transmission: vehicle.transmission || "manual",
        seat_capacity: vehicle.seat_capacity || 5,
        fuel_type: vehicle.fuel_type || "bensin",
        luggage_capacity: vehicle.luggage_capacity || 2,
        features: vehicle.features || "",
        existing_image: vehicle.image_url || ""
      });

      setPreview(vehicle.image_url);

    }

  }, [vehicle]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach(key => {

        formData.append(key, form[key]);

      });

      if (image) {

        formData.append("image", image);

      }

      if (isEdit) {

        await axios.put(

          `${API_BASE_URL}/api/vehicles/${vehicle.id}`,

          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }

        );

        alert("Berhasil mengubah kendaraan");

      } else {

        await axios.post(

          `${API_BASE_URL}/api/vehicles`,

          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }

        );

        alert("Berhasil menambah kendaraan");

      }

      refresh();

      closeModal();

    } catch (err) {

      console.log(err);

      alert("Terjadi kesalahan.");

    } finally {

      setLoading(false);

    }

  };

    return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2>
            {isEdit ? "Edit Kendaraan" : "Tambah Kendaraan"}
          </h2>

          <button
            className={styles.closeBtn}
            onClick={closeModal}
          >
            <X size={22} />
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.grid}>

            <div className={styles.formGroup}>
              <label>Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Model</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Plat Nomor</label>
              <input
                name="license_plate"
                value={form.license_plate}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Kategori</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>

            </div>

            <div className={styles.formGroup}>
              <label>Harga / Hari</label>

              <input
                type="number"
                name="price_per_day"
                value={form.price_per_day}
                onChange={handleChange}
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="tersedia">Tersedia</option>
                <option value="disewa">Disewa</option>
                <option value="maintenance">Maintenance</option>
              </select>

            </div>

            <div className={styles.formGroup}>

              <label>Transmisi</label>

              <select
                name="transmission"
                value={form.transmission}
                onChange={handleChange}
              >
                <option value="manual">Manual</option>
                <option value="matic">Matic</option>
              </select>

            </div>

            <div className={styles.formGroup}>
              <label>Kapasitas Kursi</label>

              <input
                type="number"
                name="seat_capacity"
                value={form.seat_capacity}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Bahan Bakar</label>

              <input
                name="fuel_type"
                value={form.fuel_type}
                onChange={handleChange}
              />

            </div>

            <div className={styles.formGroup}>
              <label>Kapasitas Bagasi</label>

              <input
                type="number"
                name="luggage_capacity"
                value={form.luggage_capacity}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className={styles.formGroup}>
            <label>Deskripsi</label>

            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
            />

          </div>

          <div className={styles.formGroup}>
            <label>Fitur Kendaraan</label>

            <textarea
              rows={3}
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="AC, Airbag, Kamera Mundur, Bluetooth..."
            />

          </div>

          <div className={styles.formGroup}>

            <label>Upload Gambar</label>

            <label className={styles.uploadBox}>

              <Upload size={35} />

              <span>Pilih Gambar</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />

            </label>

            {preview && (

              <img
                src={preview}
                alt=""
                className={styles.preview}
              />

            )}

          </div>

          <div className={styles.footer}>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={closeModal}
            >
              Batal
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {
                loading
                  ? "Menyimpan..."
                  : isEdit
                  ? "Update Kendaraan"
                  : "Tambah Kendaraan"
              }
            </button>

          </div>

        </form>

      </div>
    </div>
  );

}
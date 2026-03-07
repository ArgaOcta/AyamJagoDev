Kelompok AyamJago.dev
kami adalah kelompok pembuatan project web pada mata kuliah pemograman fullstuck dimana misi kami menyelesaikan project yang telah kami rancang.

Anggota:
Anwar Maulana 110224020 (Ketua)
Arga Octa Ramadhan 110224165
Muhamad Bilal Fatiha 110224182
Muhamad Bili Gunawan 110224138
Sulthan Nabil Alhakim 110224234

Tema Project kami : Website Rental Kendaraan

Fitur tersedia:
Autentikasi & Manajemen Pengguna
Booking Engine “user”
Riwayat Penyewaan “user”
Katalog & Kelola Kendaraan (CRUD)
Manajemen Pesanan & Dashboard Admin

 ERD database menggunakan mermaid
## ERD Database

```mermaid

USERS {
    INT id PK
    VARCHAR full_name
    VARCHAR email
    VARCHAR password_hash
    ENUM role
    TIMESTAMP created_at
}

VEHICLES {
    INT id PK
    VARCHAR brand
    VARCHAR model
    VARCHAR license_plate
    ENUM category
    DECIMAL price_per_day
    ENUM status
    VARCHAR image_url
    TEXT description
    TIMESTAMP created_at
}

BOOKINGS {
    INT id PK
    INT user_id FK
    INT vehicle_id FK
    DATE start_date
    DATE end_date
    INT total_days
    DECIMAL total_price
    ENUM booking_status
    TIMESTAMP created_at
}

PAYMENTS {
    INT id PK
    INT booking_id FK
    VARCHAR payment_method
    DECIMAL amount
    TIMESTAMP payment_date
    ENUM payment_status
}

USERS ||--o{ BOOKINGS : "melakukan"
VEHICLES ||--o{ BOOKINGS : "disewa dalam"
BOOKINGS ||--o{ PAYMENTS : "memiliki"

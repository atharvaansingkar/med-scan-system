# **Med-Scan-System**

**Med-Scan-System** is an automated medicine scanning and expiry detection system. It uses a webcam to scan medicines on a conveyor belt, extracts details (name, expiry date, manufacturer), and stores them in a database. Expired medicines are automatically ejected, and all data is displayed on a real-time web interface.

---

## **Features**
- **Real-Time Scanning**: Webcam captures medicine details in real-time.
- **Expiry Detection**: Automatically detects and ejects expired medicines.
- **Database Storage**: Stores medicine details (name, expiry date, manufacturer, etc.) in PostgreSQL.
- **Web Interface**: Live webcam feed, scan results, and analytics dashboard.
- **Conveyor Control**: Stops the conveyor belt and ejects expired medicines.
- **Async Processing**: Uses Celery for background OCR and processing tasks.

---

## **Tech Stack**
- **Frontend**: React (with WebRTC for live streaming, Socket.IO for real-time updates)
- **Backend**: Django REST Framework (DRF) for APIs, Celery for async tasks
- **Database**: PostgreSQL (with TimescaleDB for time-series data)
- **OCR**: OpenCV + Tesseract
- **DevOps**: Docker, GitHub Actions, Render (for hosting)
- **Hardware Integration**: Webcam (RTSP stream), Conveyor belt (GPIO/Arduino)

---

## **Folder Structure**
```bash
/med-scan-system
├── backend/               # Django backend
├── frontend/              # React frontend
├── infrastructure/        # DevOps and monitoring configs
├── scripts/               # Deployment and training scripts
├── docker-compose.yml     # Multi-container setup
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
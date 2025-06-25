# Potato Disease Prediction

A full-stack project for detecting potato leaves and predicting their diseases using deep learning (TensorFlow/Keras) and a modern React + Vite frontend.

---

## Project Structure

```
potato-disease-prediction/
│
├── api/                # FastAPI backend
│   └── main.py
│
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── get-started.jsx
│   │   │   └── upload-image.jsx
│   │   ├── components/Loader.jsx
│   │   ├── App.jsx, main.jsx, index.css, etc.
│   ├── tailwind.config.js, postcss.config.js, etc.
│
├── saved-models/       # Trained Keras models
│   ├── potato_filter.keras
│   └── potato.keras
│
├── training/           # Jupyter notebooks for model training
│   ├── Detect_Potato.ipynb
│   └── PotatoCNN.ipynb
└── ...
```

---

## Backend (FastAPI)

### Setup

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn pillow numpy tensorflow python-multipart
   ```

2. **Run the API:**
   ```bash
   cd api
   python main.py
   ```
   The API will be available at [http://localhost:8000](http://localhost:8000).

### Endpoints

- `GET /ping`  
  Health check endpoint.

- `POST /predict`  
  Accepts an image file (`file` in form-data).  
  Returns:
  - If not a potato:  
    ```json
    { "class": "non-potato image", "confidence": ... }
    ```
  - If potato:  
    ```json
    { "class": "Potato___Early_blight" | "Potato___Late_blight" | "Potato___healthy", "confidence": ... }
    ```

### Model Details

- `potato_filter.keras`: Binary classifier (potato vs. non-potato).
- `potato.keras`: Multiclass classifier (potato disease).


## Frontend (React + Vite)

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

### Features

- **Landing page:** `/`  
  "Get Started" button navigates to upload page.
- **Upload page:** `/upload-image-and-pred`  
  - Drag & drop or browse to upload an image.
  - Shows loader while predicting.
  - Displays prediction result or error.

### Tech Stack

- React 19, Vite, Tailwind CSS
- Axios for API requests
- react-dropzone for file upload
- react-router-dom for routing

---

## Model Training

- **PotatoCNN.ipynb:** Trains the disease classifier (`potato.keras`) on the PlantVillage dataset.
- **Detect_Potato.ipynb:** Trains the potato filter model (`potato_filter.keras`) to distinguish potato leaves from other images.

---

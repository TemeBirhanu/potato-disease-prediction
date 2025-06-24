from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# CORS setup
origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FILTER_MODEL = tf.keras.models.load_model("../saved-models/potato_filter.keras", compile=False)
PREDICT_MODEL = tf.keras.models.load_model("../saved-models/potato.keras", compile=False)

FILTER_CLASSES = ['non-potato', 'potato']  # binary
DISEASE_CLASSES = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']  # multiclass

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert('RGB')
    image = image.resize((256, 256))
    image = np.array(image) / 255.0
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    # Step 1: Is it a potato?
    is_potato_pred = FILTER_MODEL.predict(img_batch)
    is_potato = is_potato_pred[0][0] >= 0.5

    if not is_potato:
        return {
            "class": "non-potato image",
            "confidence": round(1 - float(is_potato_pred[0][0]), 4)
        }

    # Step 2: Predict disease (if it is a potato)
    disease_pred = PREDICT_MODEL.predict(img_batch)
    predicted_index = int(np.argmax(disease_pred[0]))
    predicted_class = DISEASE_CLASSES[predicted_index]
    confidence = float(np.max(disease_pred[0]))

    return {
        "class": predicted_class,
        "confidence": round(confidence, 4)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

from typing import Union
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.process import procesar

# Initialize FastAPI application
app = FastAPI()
app.title = "Shadow Shape"
app.version = "1.0.0"
app.description = (
    "Shadow Shape is an application connected with ChatGPT 3.5 Turbo "
    "that resolves Google forms and other types of forms, and allows access to WebSis of UMSS. "
    "In the future, it aims to integrate advanced AI features for automated data entry, "
    "enhanced form processing, and seamless interaction with various web services and APIs. "
    "Additionally, it plans to support multilingual processing, providing users with a versatile tool "
    "for academic and administrative tasks.\n\n"
    "Aplicación conectada con ChatGPT 3.5 Turbo que resuelve formularios de Google y otros, "
    "y permite acceder a la WebSis de la UMSS. En el futuro, se pretende integrar funciones avanzadas de IA "
    "para la entrada automática de datos, el procesamiento mejorado de formularios y la interacción sin problemas "
    "con diversos servicios web y APIs. Además, planea soportar el procesamiento multilingüe, proporcionando a los usuarios "
    "una herramienta versátil para tareas académicas y administrativas."
)

# Configure CORS to allow any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Also allow OPTIONS
    allow_headers=["*"],
)

# Root endpoint
@app.get("/", tags=['Home'])
def read_root():
    return "Hola mundo"

# Endpoint to process an image via POST request
@app.post("/procesar_imagen", tags=['Image'])
async def procesar_imagen(file: UploadFile = File(...)):
    try:
        file_path = f"./src/images/pruebas/{file.filename}"
        
        # Verify and create directory if it does not exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Example processing using the 'procesar' function from the 'src.process' module
        print(file_path)
        resultado = procesar(file_path)
        print(resultado)
        # Example JSON response with processing result
        return JSONResponse(content={"resultado": resultado})
    except Exception as e:
        print(f"Error en procesar_imagen: {e}")  # Print error to console
        return JSONResponse(status_code=500, content={"error": str(e)})

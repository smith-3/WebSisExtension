import os
from PIL import Image

def process_image(image_path):
    try:
        # Verificar si el archivo existe
        if not os.path.exists(image_path):
            print(f"El archivo no se encuentra en la ruta: {image_path}")
            return None

        # Cargar una imagen
        image = Image.open(image_path)

        # Convertir la imagen a escala de grises de 8 bits
        image_gray = image.convert('L')

        # Quitar las 8 primeras filas y las 5 últimas filas
        cropped_image = image_gray.crop((0, 8, image_gray.width, image_gray.height - 5))
        return cropped_image
    except Exception as e:
        print(f"Error al procesar la imagen {image_path}: {str(e)}")
        return None

def compare_images(reference_image, items):
    try:
        best_match_items = []
        # Obtener dimensiones de la imagen de referencia
        ref_width, ref_height = reference_image.size
        segment_start = 0
        # Comparar por segmentos verticales (columnas)
        while segment_start < ref_width:
            # Comparar con letras
            segment_base = 1
            min_diff_letter = float('inf')
            best_match_letter = None
            for file_name, image_gray in items:
                segment_end = segment_start + image_gray.width
                if segment_end < ref_width:
                    ref_segment = reference_image.crop((segment_start, 0, segment_end, ref_height))
                    diff = calculate_difference(ref_segment, image_gray)
                    if diff < 1900:
                        min_diff_letter = diff
                        best_match_letter = file_name
                        segment_base = image_gray.width
                        print(image_gray.width)
            if best_match_letter:
                best_match_items.append(best_match_letter)

            segment_start += segment_base
        # Construir el resultado final
        best_match = "".join(best_match_items)
        return best_match
    
    except Exception as e:
        print(f"Error al comparar imágenes: {str(e)}")
        return None

def calculate_difference(image1, image2):
    """
    Calcula la diferencia entre dos imágenes (objetos Image de Pillow).
    """
    diff = 0
    for y in range(image1.height):
        for x in range(image1.width):
            diff += abs(image1.getpixel((x, y)) - image2.getpixel((x, y)))
    return diff

def load_and_process_images(image_dir):
    try:
        image_files = [f for f in os.listdir(image_dir) if f.endswith('.png')]
        processed_images = []

        for image_file in image_files:
            image_path = os.path.join(image_dir, image_file)
            image = Image.open(image_path)
            image_gray = image.convert('L')
            if image_gray is not None:
                processed_images.append((image_file[0], image_gray))
                #print(f"Dimensiones de imagen procesada {image_file}: {image_gray.size}")

        return processed_images
    
    except FileNotFoundError:
        print(f"El directorio {image_dir} no existe.")
        return []
    except Exception as e:
        print(f"Error al cargar y procesar imágenes desde {image_dir}: {str(e)}")
        return []

def procesar(reference_image_path):
    try:
        # Procesar la imagen de referencia
        reference_image = process_image(reference_image_path)
        if reference_image is not None:
            # Definir las rutas de los directorios de imágenes
            image_dir_numbers = './src/images/123'
            image_dir_letters = './src/images/abc'

            # Cargar y procesar las imágenes de números y letras
            numbers = load_and_process_images(image_dir_numbers)
            images = load_and_process_images(image_dir_letters)
            images.extend(numbers)  # Combina las listas de letras y números

            # Comparar la imagen de referencia con las imágenes procesadas
            best_match = compare_images(reference_image, images)
            print("cargo")

            if best_match:
                return best_match
            else:
                return "X"
        else:
            return "X"
    
    except Exception as e:
        print(f"Error en el proceso principal: {str(e)}")
        return "X"

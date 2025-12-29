import cv2
import numpy as np
from PIL import Image

def preprocess_image(pil_image):
    """
    Task-2: Noise Reduction.
    Converts image to grayscale and applies adaptive thresholding
    to handle shadows and inconsistent lighting.
    """
    # Convert PIL Image to OpenCV format (numpy array)
    img_array = np.array(pil_image)

    # Convert RGB to BGR (OpenCV standard)
    if len(img_array.shape) == 3:
        img_array = img_array[:, :, ::-1].copy()

    # 1. Grayscale Conversion (Removes color noise)
    gray_img = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)

    # 2. Adaptive Thresholding (The main 'Noise Reduction' step)
    # This looks at small neighborhoods of pixels to decide if they are black or white.
    # It is much better than simple thresholding for scanned documents.
    clean_img = cv2.adaptiveThreshold(
        gray_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # Convert back to PIL Image so Tesseract can read it
    return Image.fromarray(clean_img)
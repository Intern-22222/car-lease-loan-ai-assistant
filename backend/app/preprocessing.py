"""
Preprocessing Module - OpenCV Image Enhancement for OCR
Applies noise reduction, adaptive thresholding, and other CV techniques
to improve OCR accuracy on noisy/scanned documents.
"""

import cv2
import numpy as np
from PIL import Image
from typing import Optional, Tuple
import os


def preprocess_for_ocr(
    image: np.ndarray,
    method: str = "adaptive"
) -> np.ndarray:
    """
    Preprocess image for optimal OCR results.
    
    Args:
        image: Input image as numpy array (BGR or grayscale)
        method: Preprocessing method - "adaptive", "otsu", or "simple"
        
    Returns:
        Preprocessed image ready for Tesseract OCR
    """
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    if method == "adaptive":
        return adaptive_threshold_preprocessing(gray)
    elif method == "otsu":
        return otsu_preprocessing(gray)
    else:
        return simple_preprocessing(gray)


def adaptive_threshold_preprocessing(gray: np.ndarray) -> np.ndarray:
    """
    Advanced preprocessing using adaptive thresholding.
    Best for documents with uneven lighting, shadows, or coffee stains.
    
    Args:
        gray: Grayscale image
        
    Returns:
        Preprocessed binary image
    """
    # Step 1: Noise reduction with bilateral filter (preserves edges)
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Step 2: Adaptive thresholding to handle uneven lighting
    # This removes shadows and adjusts for local contrast
    binary = cv2.adaptiveThreshold(
        denoised,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,  # Block size
        2    # Constant subtracted from mean
    )
    
    # Step 3: Morphological operations to remove small noise
    kernel = np.ones((1, 1), np.uint8)
    cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    
    # Step 4: Additional denoising
    final = cv2.fastNlMeansDenoising(cleaned, None, 10, 7, 21)
    
    return final


def otsu_preprocessing(gray: np.ndarray) -> np.ndarray:
    """
    Preprocessing using Otsu's binarization.
    Good for documents with uniform lighting.
    
    Args:
        gray: Grayscale image
        
    Returns:
        Preprocessed binary image
    """
    # Denoise first
    denoised = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Otsu's thresholding
    _, binary = cv2.threshold(
        denoised,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    
    return binary


def simple_preprocessing(gray: np.ndarray) -> np.ndarray:
    """
    Simple preprocessing with basic thresholding.
    Fastest method, good for clean documents.
    
    Args:
        gray: Grayscale image
        
    Returns:
        Preprocessed binary image
    """
    # Simple Gaussian blur
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    
    # Fixed threshold
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY)
    
    return binary


def remove_borders(image: np.ndarray, border_size: int = 10) -> np.ndarray:
    """
    Remove borders from scanned documents.
    
    Args:
        image: Input image
        border_size: Pixels to remove from each edge
        
    Returns:
        Image with borders removed
    """
    h, w = image.shape[:2]
    return image[border_size:h-border_size, border_size:w-border_size]


def deskew(image: np.ndarray) -> np.ndarray:
    """
    Deskew/straighten a scanned image.
    
    Args:
        image: Input image
        
    Returns:
        Deskewed image
    """
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    # Detect edges
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    
    # Detect lines using Hough transform
    lines = cv2.HoughLines(edges, 1, np.pi/180, 200)
    
    if lines is None or len(lines) == 0:
        return image  # No deskewing needed
    
    # Calculate median angle
    angles = []
    for rho, theta in lines[:, 0]:
        angle = theta * 180 / np.pi - 90
        angles.append(angle)
    
    median_angle = np.median(angles)
    
    # If angle is very small, don't rotate
    if abs(median_angle) < 0.5:
        return image
    
    # Rotate image
    h, w = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
    rotated = cv2.warpAffine(
        image,
        M,
        (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )
    
    return rotated


def enhance_contrast(image: np.ndarray) -> np.ndarray:
    """
    Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization).
    
    Args:
        image: Grayscale image
        
    Returns:
        Contrast-enhanced image
    """
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(image)
    return enhanced


def save_debug_image(
    image: np.ndarray,
    output_path: str,
    label: str = ""
) -> None:
    """
    Save preprocessed image for debugging/visualization.
    
    Args:
        image: Image to save
        output_path: Path to save the image
        label: Optional label to add to filename
    """
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    
    if label:
        base, ext = os.path.splitext(output_path)
        output_path = f"{base}_{label}{ext}"
    
    cv2.imwrite(output_path, image)


def pil_to_cv2(pil_image: Image.Image) -> np.ndarray:
    """
    Convert PIL Image to OpenCV format.
    
    Args:
        pil_image: PIL Image
        
    Returns:
        OpenCV image (numpy array)
    """
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)


def cv2_to_pil(cv2_image: np.ndarray) -> Image.Image:
    """
    Convert OpenCV image to PIL format.
    
    Args:
        cv2_image: OpenCV image (numpy array)
        
    Returns:
        PIL Image
    """
    if len(cv2_image.shape) == 2:  # Grayscale
        return Image.fromarray(cv2_image)
    else:  # Color
        return Image.fromarray(cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB))


def preprocess_pil_image(
    pil_image: Image.Image,
    method: str = "adaptive",
    deskew_enabled: bool = False,
    enhance_contrast_enabled: bool = False
) -> Image.Image:
    """
    Preprocess a PIL image for OCR (convenience function).
    
    Args:
        pil_image: Input PIL Image
        method: Preprocessing method
        deskew_enabled: Whether to deskew the image
        enhance_contrast_enabled: Whether to enhance contrast
        
    Returns:
        Preprocessed PIL Image
    """
    # Convert to OpenCV
    cv2_img = pil_to_cv2(pil_image)
    
    # Convert to grayscale
    gray = cv2.cvtColor(cv2_img, cv2.COLOR_BGR2GRAY)
    
    # Optional: Deskew
    if deskew_enabled:
        gray = deskew(gray)
    
    # Optional: Enhance contrast
    if enhance_contrast_enabled:
        gray = enhance_contrast(gray)
    
    # Main preprocessing
    processed = preprocess_for_ocr(gray, method=method)
    
    # Convert back to PIL
    return cv2_to_pil(processed)

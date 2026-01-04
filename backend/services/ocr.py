import io
import pdfplumber
from PIL import Image
import pytesseract

def extract_text(file_byte: bytes,filename:str)->str:
    # extarct text from file
    text=""
    if filename.lower().endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(file_byte)) as pdf:
            for page in pdf.pages:
                page_text=page.extract_text()
                if page_text:
                    text+=page_text+"\n"
                    
    # if the pdf is in image form + io.BytesIO(file_bytes) wraps those bytes in a file-like object (so libraries can read it as if it were a file)

    if len(text.strip())<=50:
        with pdfplumber.open(io.BytesIO(file_byte)) as pdf:
            for page in pdf.pages:
                im=page.to_image(resolution=300).original
                text+=pytesseract.image_to_string(im)+"\n"
                
    else:
        if filename.lower().endswith((".png",".jpg",".jpeg",".tiff",".bmp")):
            im=Image.open(io.BytesIO(file_byte))
            text=pytesseract.image_to_string(im)
    
    return text.strip()
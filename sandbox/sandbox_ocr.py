import json
import logging
import re
from pathlib import Path
from datetime import datetime, timezone

import pytesseract
from pdf2image import convert_from_path
from PIL import Image

INPUT_DIR = Path("samples")
OUTPUT_DIR = Path("sandbox_output")
DPI = 300
OCR_ENGINE = "tesseract"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
INPUT_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)

def get_first_pdf() -> Path:
    for file in INPUT_DIR.iterdir():
        if file.suffix.lower() == ".pdf":
            return file
    raise FileNotFoundError("No PDF found in samples/")

def ocr_image(image: Image.Image) -> str:
    return pytesseract.image_to_string(
        image,
        config="--oem 3 --psm 6"
    )

def pdf_to_txt(pdf_path: Path, txt_path: Path) -> None:
    logger.info("Running OCR to generate TXT...")
    try:
        pages = convert_from_path(pdf_path, dpi=DPI)
    except Exception as e:
        logger.error(f"Failed to convert PDF to images: {e}")
        raise

    output = []
    for idx, page in enumerate(pages, start=1):
        logger.info("OCR page %d", idx)
        output.append(f"\n--- Page {idx} ---\n")
        output.append(ocr_image(page))

    txt_path.write_text("\n".join(output), encoding="utf-8")
    logger.info("TXT generated: %s", txt_path.name)

def load_txt(txt_path: Path) -> str:
    return txt_path.read_text(encoding="utf-8")

def get_clean_lines(text: str) -> list[str]:
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if len(line) >= 3:
            lines.append(line)
    return lines

def extract_sla_data(text: str) -> dict:
    sla = {}
    lines = get_clean_lines(text)

    for line in lines:
        compact = line.lower().replace(" ", "")

        if "tenure" in compact or "duration" in compact:
            m = re.search(r"(\d{1,3})", line)
            if m:
                sla["tenure_months"] = int(m.group(1))

        elif "interest" in compact or "roi" in compact:
            m = re.search(r"(\d{1,2}\.?\d*)", line)
            if m:
                sla["interest_rate"] = m.group(1)

        elif "emi" in compact:
            m = re.search(r"([\d,]{3,})", line)
            if m:
                sla["emi_amount"] = int(m.group(1).replace(",", ""))

        elif "penalty" in compact or "late" in compact:
            m = re.search(r"([\d,]{3,})", line)
            if m:
                sla["late_payment_penalty"] = int(m.group(1).replace(",", ""))

    return sla

def extract_vehicle_data(text: str) -> dict:
    vehicle = {}
    lines = get_clean_lines(text)
    
    def clean_val(v):
        return v.replace(" ", "").replace("-", "").replace(".", "").strip().upper()

    relaxed_value_pattern = re.compile(r"\b(?=.*\d)[A-Z0-9\s-]{6,25}\b")
    reg_strict_pattern = re.compile(r"[A-Z]{2}[ -]?\d{1,2}[ -]?[A-Z0-9]{0,4}[ -]?\d{3,4}")

    for i, line in enumerate(lines):
        line_upper = line.upper()

        if "registration_number" not in vehicle:
            if "REG" in line_upper or "VEHICLE NO" in line_upper or "RC NO" in line_upper:
                matches = reg_strict_pattern.findall(line_upper)
                
                if not matches and i + 1 < len(lines):
                    matches = reg_strict_pattern.findall(lines[i+1].upper())
                
                if matches:
                    vehicle["registration_number"] = clean_val(matches[0])

        if "chassis_number" not in vehicle:
            if "CHASSIS" in line_upper or "VIN" in line_upper:
                clean_line = line_upper.replace("CHASSIS", "").replace("VIN", "").replace("NO", "")
                
                matches = relaxed_value_pattern.findall(clean_line)
                
                if not matches and i + 1 < len(lines):
                    matches = relaxed_value_pattern.findall(lines[i+1].upper())

                if matches:
                    val = clean_val(matches[0])
                    if len(val) > 8: 
                        vehicle["chassis_number"] = val

        if "engine_number" not in vehicle:
            if "ENGINE" in line_upper or "MOTOR NO" in line_upper:
                clean_line = line_upper.replace("ENGINE", "").replace("MOTOR", "").replace("NO", "")
                
                matches = relaxed_value_pattern.findall(clean_line)
                
                if not matches and i + 1 < len(lines):
                    matches = relaxed_value_pattern.findall(lines[i+1].upper())
                
                if matches:
                    val = clean_val(matches[0])
                    if len(val) > 5:
                        vehicle["engine_number"] = val

        if "fuel_type" not in vehicle:
            if "DIESEL" in line_upper:
                vehicle["fuel_type"] = "Diesel"
            elif "PETROL" in line_upper:
                vehicle["fuel_type"] = "Petrol"
            elif "ELECTRIC" in line_upper or "EV" in line_upper:
                vehicle["fuel_type"] = "Electric"
            elif "CNG" in line_upper:
                vehicle["fuel_type"] = "CNG"
            elif "HYBRID" in line_upper:
                 vehicle["fuel_type"] = "Hybrid"

    return vehicle

def main() -> None:
    try:
        try:
            pdf_file = get_first_pdf()
        except FileNotFoundError:
            logger.error("No PDF found. Please put a .pdf file in the 'samples' folder.")
            return

        logger.info("Processing PDF: %s", pdf_file.name)
        txt_path = OUTPUT_DIR / f"{pdf_file.stem}.txt"

        if not txt_path.exists():
            pdf_to_txt(pdf_file, txt_path)
        else:
            logger.info("TXT already exists, skipping OCR")

        text = load_txt(txt_path)

        result = {
            "metadata": {
                "source_pdf": pdf_file.name,
                "txt_file": txt_path.name,
                "ocr_engine": OCR_ENGINE,
                "processed_at": datetime.now(timezone.utc).isoformat(),
            },
            "sla_data": extract_sla_data(text),
            "vehicle_data": extract_vehicle_data(text),
        }

        json_path = OUTPUT_DIR / f"{pdf_file.stem}.json"
        json_path.write_text(json.dumps(result, indent=4), encoding="utf-8")

        logger.info("Extraction completed successfully")
        logger.info("JSON Output: %s", json_path.resolve())

    except Exception as exc:
        logger.exception("Processing failed: %s", exc)
        raise SystemExit(1)

if __name__ == "__main__":
    main()
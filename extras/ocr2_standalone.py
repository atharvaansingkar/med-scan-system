import cv2
import pytesseract
import re
from datetime import datetime
import numpy as np
from test import imagew

# Path to your image
image_path = 'extras/meds2.jpg'  # Update path if needed

# Tesseract config
tess_config = r'--oem 3 --psm 6'

# Rotate image helper
def rotate_image(image, angle):
    if angle == 0:
        return image
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

# OCR text extraction
def extract_text(img):
    return pytesseract.image_to_string(img, config=tess_config)

# Product name extraction
def extract_product_name(text):
    product_keywords = ["Crocin", "Evion 400", "Roko"]
    for keyword in product_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            return keyword
    return "Not found"

# Expiry date extraction
def extract_expiry_date(text):
    text = re.sub(r'\s+', ' ', text)

    exp_match = re.search(r'EXP[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if exp_match:
        month = exp_match.group(1)
        year = exp_match.group(2)
        if not (1 <= int(month) <= 12):
            return "Not found"
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month.zfill(2)}/{year}"

    # Handle month names like JUL 2026
    exp_text_match = re.search(r'EXP[\.:]*\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\.\- ]+(\d{2,4})', text, re.IGNORECASE)
    if exp_text_match:
        month_name = exp_text_match.group(1).upper()
        year = exp_text_match.group(2)
        month_dict = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        month = month_dict.get(month_name, '01')
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month}/{year}"

    return "Not found"

# Manufacturing date extraction
def extract_mfd_date(text):
    text = re.sub(r'\s+', ' ', text)

    mfd_match = re.search(r'(MFD|MFG)[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if mfd_match:
        month = mfd_match.group(2)
        year = mfd_match.group(3)
        if not (1 <= int(month) <= 12):
            return "Not found"
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month.zfill(2)}/{year}"

    # Handle month names like JUL 24
    mfd_text_match = re.search(r'(MFD|MFG)[\.:]*\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\.\- ]+(\d{2,4})', text, re.IGNORECASE)
    if mfd_text_match:
        month_name = mfd_text_match.group(2).upper()
        year = mfd_text_match.group(3)
        month_dict = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        month = month_dict.get(month_name, '01')
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month}/{year}"

    return "Not found"

# --- Main Script ---

# Load image
image = cv2.imread(image_path)
if image is None:
    print("Error: Image not found.")
    exit()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
angles = [0, 90, 180, 270]
parsed_results = []

for angle in angles:
    rotated = rotate_image(gray, angle)
    text = extract_text(rotated)
    print(f"\n--- Rotation {angle} ---")
    print(text)

    product_name = extract_product_name(text)
    expiry_date = extract_expiry_date(text)
    mfd_date = extract_mfd_date(text)

    parsed_results.append({
        'angle': angle,
        'product_name': product_name,
        'expiry_date': expiry_date,
        'mfd_date': mfd_date
    })

# Pick best extracted values
expiry_dates = [r['expiry_date'] for r in parsed_results if r['expiry_date'] != "Not found"]
mfd_dates = [r['mfd_date'] for r in parsed_results if r['mfd_date'] != "Not found"]

final_expiry = max(expiry_dates, key=lambda date: datetime.strptime(date, "%m/%Y")) if expiry_dates else "Not found"
final_mfd = min(mfd_dates, key=lambda date: datetime.strptime(date, "%m/%Y")) if mfd_dates else "Not found"
final_name = next((r['product_name'] for r in parsed_results if r['product_name'] != "Not found"), "Not found")

#Date Format
forced_mfd, forced_expiry = imagew(final_name)

if forced_mfd:
    final_mfd = forced_mfd
if forced_expiry:
    final_expiry = forced_expiry

# ➡️ Determine status based on expiry
status = "unknown"
if final_expiry != "Not found":
    try:
        exp_datetime = datetime.strptime(final_expiry, "%m/%Y")
        now = datetime.now()
        if exp_datetime < now:
            status = "expired"
        else:
            status = "Good for use!"
    except ValueError:
        status = "unknown"

# Final Output
print("\n\nParsed Results:")
print("Product Name:", final_name)
print("MFD Date:", final_mfd)
print("Expiry Date:", final_expiry)
print("Status:", status)


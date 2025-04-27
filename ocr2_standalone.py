import cv2
import pytesseract
from PIL import Image
import numpy as np
import re
from datetime import datetime

# Path to your image
image_path = 'latest_capture.jpg'  # Update if needed

# Tesseract config
tess_config = r'--oem 3 --psm 6'

def rotate_image(image, angle):
    if angle == 0:
        return image
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

def extract_text(img):
    return pytesseract.image_to_string(img, config=tess_config)

def extract_product_name(text):
    product_match = re.search(r'Evion\s*®?\s*400', text, re.IGNORECASE)
    if product_match:
        return product_match.group().strip()
    return "Not found"

def extract_expiry_date(text):
    text = re.sub(r'\s+', ' ', text)

    exp_match = re.search(r'EXP[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if exp_match:
        month = exp_match.group(1)
        year = exp_match.group(2)

        if month == '41':
            month = '11'
        elif not (1 <= int(month) <= 12):
            return "Not found"

        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"

        return f"{month.zfill(2)}/{year}"

    fallback = re.findall(r'(0[1-9]|1[0-2])[\/\-](\d{4})', text)
    if fallback:
        return f"{fallback[0][0]}/{fallback[0][1]}"

    return "Not found"

def extract_mfd_date(text):
    text = re.sub(r'\s+', ' ', text)

    mfd_match = re.search(r'(MFD|MFG)[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if mfd_match:
        month = mfd_match.group(2)
        year = mfd_match.group(3)

        if month == '41':
            month = '11'
        elif not (1 <= int(month) <= 12):
            return "Not found"

        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"

        return f"{month.zfill(2)}/{year}"

    return "Not found"

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

# Filter and pick best values
expiry_dates = [r['expiry_date'] for r in parsed_results if r['expiry_date'] != "Not found"]
mfd_dates = [r['mfd_date'] for r in parsed_results if r['mfd_date'] != "Not found"]

final_expiry = max(expiry_dates, key=lambda date: datetime.strptime(date, "%m/%Y")) if expiry_dates else "Not found"
final_mfd = min(mfd_dates, key=lambda date: datetime.strptime(date, "%m/%Y")) if mfd_dates else "Not found"
final_name = next((r['product_name'] for r in parsed_results if r['product_name'] != "Not found"), "Not found")

# Final Output
print("\n\nParsed Results:")
print("Product Name:", final_name)
print("MFD Date:", final_mfd)
print("Expiry Date:", final_expiry)

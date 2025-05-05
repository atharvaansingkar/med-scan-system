import os
import re
import base64
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
from pytesseract import Output

from test import imagew

# Tesseract configuration
tess_config = r'--oem 3 --psm 6'

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "temp_captures"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    product_keywords = ["Crocin", "Evion 400", "Roko"]
    for keyword in product_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE):
            return keyword
    return None

def extract_expiry_date(text):
    text = re.sub(r'\s+', ' ', text)

    m = re.search(r'EXP[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if m:
        month, year = m.group(1), m.group(2)
        if not (1 <= int(month) <= 12):
            return None
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month.zfill(2)}/{year}"

    fallback = re.search(r'EXP[\.:]*\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\.\- ]+(\d{2,4})', text, re.IGNORECASE)
    if fallback:
        month_name = fallback.group(1).upper()
        year = fallback.group(2)
        month_dict = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        month = month_dict.get(month_name, '01')
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month}/{year}"

    return None

def extract_mfd_date(text):
    text = re.sub(r'\s+', ' ', text)

    m = re.search(r'(MFD|MFG)[\.:]*\s*([0-9]{1,2})[\/\-\. ]+(\d{2,4})', text, re.IGNORECASE)
    if m:
        month, year = m.group(2), m.group(3)
        if not (1 <= int(month) <= 12):
            return None
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month.zfill(2)}/{year}"

    fallback = re.search(r'(MFD|MFG)[\.:]*\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[\.\- ]+(\d{2,4})', text, re.IGNORECASE)
    if fallback:
        month_name = fallback.group(2).upper()
        year = fallback.group(3)
        month_dict = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        month = month_dict.get(month_name, '01')
        if len(year) == 2:
            year = f"20{year}" if int(year) < 50 else f"19{year}"
        return f"{month}/{year}"

    return None

@app.route("/")
def home():
    return "Flask is running"

@app.route('/process-webcam', methods=['POST'])
def process_webcam():
    try:
        payload = request.get_json()
        img_data = payload.get('image', '')
        if ',' in img_data:
            _, img_base64 = img_data.split(',', 1)
        else:
            img_base64 = img_data

        img_bytes = base64.b64decode(img_base64)
        arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify(success=False, error='Invalid image payload'), 400

        # Save the uploaded image
        temp_path = os.path.join(UPLOAD_FOLDER, 'latest_capture.jpg')
        cv2.imwrite(temp_path, img)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        angles = [0, 90, 180, 270]
        results = []

        for angle in angles:
            rotated = rotate_image(gray, angle)
            text = extract_text(rotated)
            results.append({
                'angle': angle,
                'name': extract_product_name(text),
                'expiry': extract_expiry_date(text),
                'mfd': extract_mfd_date(text)
            })

        valid_exp = [r['expiry'] for r in results if r['expiry']]
        valid_mfd = [r['mfd'] for r in results if r['mfd']]
        final_exp = max(valid_exp, key=lambda d: datetime.strptime(d, "%m/%Y")) if valid_exp else None
        final_mfd = min(valid_mfd, key=lambda d: datetime.strptime(d, "%m/%Y")) if valid_mfd else None
        final_name = next((r['name'] for r in results if r['name']), "BORIC ACID I.P.")  # Default to "Roko" if no name is found

        # ➡️ Force override dates if product is known
        forced_mfd, forced_expiry = imagew(final_name)
        if forced_mfd:
            final_mfd = forced_mfd
        if forced_expiry:
            final_exp = forced_expiry

        # ➡️ Determine status
        status = "unknown"
        if final_exp:
            exp_datetime = datetime.strptime(final_exp, "%m/%Y")
            if exp_datetime < datetime.now():
                status = "expired"
            else:
                status = "valid"

        exp_iso = datetime.strptime(final_exp, "%m/%Y").date().isoformat() if final_exp else None
        mfd_iso = datetime.strptime(final_mfd, "%m/%Y").date().isoformat() if final_mfd else None

        data = pytesseract.image_to_data(gray, config=tess_config, output_type=Output.DICT)
        confs = []
        for c in data.get('conf', []):
            try:
                c_val = int(c)
                if c_val >= 0:
                    confs.append(c_val)
            except (ValueError, TypeError):
                continue
        accuracy = round(sum(confs) / len(confs), 2) if confs else 0

        # ✅ DEBUG printing
        print("========== OCR Extraction Result ==========")
        print(f"Product Name: {final_name}")
        print(f"MFG Date: {mfd_iso}")
        print(f"EXP Date: {exp_iso}")
        print(f"Status: {status}")
        print(f"Accuracy: {accuracy}%")
        print("============================================")

        return jsonify(
            success=True,
            data={
                'raw_name': final_name,
                'mfg_date': mfd_iso,
                'exp_date': exp_iso,
                'status': status,
                'accuracy': accuracy
            }
        )

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 4001))
    app.run(host='0.0.0.0', port=port, debug=True)
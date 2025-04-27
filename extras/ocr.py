import cv2, pytesseract, re, numpy as np, base64
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from supabase import create_client
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# CORS only for your React origin
CORS(app, resources={
    r"/process-webcam": {
        "origins": "http://localhost:3000",
        "methods": ["POST","OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Supabase client (replace with your creds)
supabase = create_client(
    "https://<YOUR-SUPABASE-URL>.supabase.co",
    "<YOUR-ANON-KEY>"
)

# Global handler: turn uncaught exceptions into JSON
@app.errorhandler(Exception)
def handle_all_exceptions(e):
    code = e.code if isinstance(e, HTTPException) else 500
    app.logger.error("Unhandled exception", exc_info=e)
    return jsonify(success=False, error=str(e)), code

def validate_image(image_b64):
    if not image_b64.startswith('data:image/'):
        return False
    try:
        _, data = image_b64.split(',', 1)
        img = cv2.imdecode(
            np.frombuffer(base64.b64decode(data), np.uint8),
            cv2.IMREAD_COLOR
        )
        return img is not None
    except Exception:
        return False

@app.route('/process-webcam', methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:3000", methods=["POST","OPTIONS"])
def handle_scan():
    # Let OPTIONS preflight pass
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    try:
        payload = request.get_json(force=True)
        img_b64 = payload.get('image','')
        if not validate_image(img_b64):
            return jsonify(success=False, error="Invalid image"), 400

        # Decode and OCR
        _, encoded = img_b64.split(',',1)
        img = cv2.imdecode(
            np.frombuffer(base64.b64decode(encoded), np.uint8),
            cv2.IMREAD_COLOR
        )
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray)

        # Extract fields
        comp_m  = re.search(r'Company:?\s*([\w\s&]+)', text)
        med_m   = re.search(r'(?:Drug|Medicine):?\s*([A-Z][\w\s-]+)', text)
        exp_m   = re.search(r'Exp(?:\.|iry):?\s*(\d{2}/\d{2}/\d{4})', text)
        batch_m = re.search(r'Batch:?\s*([A-Z0-9-]+)', text)

        # Calculate accuracy (% of company, medicine, expiry found)
        found   = [bool(comp_m), bool(med_m), bool(exp_m)]
        accuracy= round(sum(found)/3 * 100)

        if not all(found):
            return jsonify(success=False, error="Missing fields", accuracy=accuracy), 200

        company    = comp_m.group(1).strip()
        medicine   = med_m.group(1).strip()
        expiry_dt  = datetime.strptime(exp_m.group(1), "%d/%m/%Y")
        status     = "expired" if expiry_dt < datetime.now() else "valid"

        # Verify against stored_medicines
        catalog = supabase.table('stored_medicines')\
            .select('id')\
            .eq('company', company)\
            .eq('medicine', medicine)\
            .execute()
        if catalog.error or not catalog.data:
            return jsonify(success=False, error="Unknown medicine", accuracy=accuracy), 200

        # Insert scan record
        record = {
            "company": company,
            "medicine": medicine,
            "batch": batch_m.group(1).strip() if batch_m else None,
            "expiry": expiry_dt.date().isoformat(),
            "status": status,
            "raw_text": text,
            "accuracy": accuracy
        }
        inserted = supabase.table('scans').insert(record).execute()
        if inserted.error:
            raise Exception(inserted.error.message)

        return jsonify(success=True, data=inserted.data[0]), 200

    except Exception as e:
        # This will now be caught by the global handler,
        # but you can also log here if you like
        app.logger.error("Error in handle_scan", exc_info=e)
        raise

if __name__ == '__main__':
    # Enable debug=True if you want full tracebacks in console
    app.run(host='0.0.0.0', port=4001, debug=True)

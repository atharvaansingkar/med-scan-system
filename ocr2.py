import cv2
import pytesseract
import re
from flask import Flask, jsonify

app = Flask(__name__)

# Process image from local storage
def process_stored_image():
    # Load the image from storage (assumes 'temp.jpg' is present)
    image = cv2.imread('captured_image.jpg')
    if image is None:
        return "Error: Could not load the image from storage."

    # Convert to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply thresholding
    _, thresh = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours on the original image
    contour_image = cv2.cvtColor(gray_image, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(contour_image, contours, -1, (0, 255, 0), 2)

    # Extract text using Tesseract OCR
    text = pytesseract.image_to_string(thresh)

    return text

# Parse text to detect product name and date formats
def parse_text(text):
    # Detect date formats (e.g., DD/MM/YYYY, MM/YYYY, etc.)
    date_match = re.findall(r'\b(?:\d{1,2}/\d{1,2}/\d{4}|\d{1,2}/\d{4})\b', text)

    # Detect product name (assuming it's a line with alphanumeric characters)
    product_name_match = re.search(r'^[A-Za-z0-9\s]+$', text, re.MULTILINE)

    product_name = product_name_match.group(0) if product_name_match else "Not found"
    dates = date_match if date_match else ["Not found"]

    return product_name, dates

# Flask API endpoint
@app.route('/process-image', methods=['GET'])
def process_image():
    try:
        # Process the stored image
        extracted_text = process_stored_image()
        if isinstance(extracted_text, str) and extracted_text.startswith("Error"):
            return jsonify({"error": extracted_text}), 500

        # Parse the extracted text
        product_name, dates = parse_text(extracted_text)

        # Return the results as JSON
        return jsonify({
            "product_name": product_name,
            "dates": dates,
            "raw_text": extracted_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on port 4001
    app.run(debug=True, port=4001)

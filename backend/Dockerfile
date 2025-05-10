FROM python:3.11-slim

# Install system packages
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app files
COPY . .

# Expose the port Render will use
EXPOSE 4001

# Start the Flask app using gunicorn
CMD ["gunicorn", "ocr_service:app", "--bind", "0.0.0.0:4001"]

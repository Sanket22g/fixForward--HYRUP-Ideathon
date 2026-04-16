# Use the official Python base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the API script into the container
COPY api.py .

# Copy the models directory into the container
# Make sure your models are in a folder named 'model' or 'models' in the same directory as this Dockerfile
COPY model/ ./model/

# Expose the port the app runs on (Hugging Face default is 7860)
EXPOSE 7860

# Command to run the application using Uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]

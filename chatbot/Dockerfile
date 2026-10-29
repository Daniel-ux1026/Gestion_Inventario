FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd --system lirio && chown -R lirio /app
USER lirio
EXPOSE 8501
CMD ["streamlit","run","app.py","--server.headless","true","--server.address","0.0.0.0","--server.port","8501","--server.baseUrlPath","chatbot"]

FROM python:3.11-slim

# Instalar netcat-openbsd para verificar la disponibilidad de servicios (por ejemplo, PostgreSQL)
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Evita que Python escriba archivos .pyc y fuerza salida sin búfer
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copiamos e instalamos dependencias
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiamos el resto del código
COPY . .

# Damos permisos al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]

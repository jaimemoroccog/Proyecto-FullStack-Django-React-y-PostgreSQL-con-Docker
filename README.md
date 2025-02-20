# Proyecto Integrado: Django + React + PostgreSQL con Docker

Este proyecto es una plantilla para desarrollar y desplegar un sistema full-stack utilizando:

- **Backend:** Django 4.2 con Django Rest Framework para exponer una API REST.
- **Frontend:** React 18 con Vite para una experiencia de desarrollo ágil.
- **Base de Datos:** PostgreSQL.
- **Contenedores Docker:** Se utilizan contenedores para cada componente y Docker Compose para orquestar el entorno.

El proyecto incluye configuraciones separadas para desarrollo y producción.

---

## 📂 Estructura del Proyecto

```
project/
├── docker-compose.dev.yml         # Configuración de Docker Compose para desarrollo
├── docker-compose.prod.yml        # Configuración de Docker Compose para producción
├── .gitignore
├── README.md                      # Este archivo
├── backend/
│   ├── Dockerfile                 # Dockerfile para el backend
│   ├── requirements.txt           # Dependencias de Python (Django, DRF, psycopg2, etc.)
│   ├── entrypoint.sh              # Script de entrada que ejecuta migraciones y arranca el servidor
│   ├── manage.py
│   ├── myproject/
│   │   ├── settings.py            # Configuración general (CORS, apps instaladas, etc.)
│   │   ├── urls.py                # Rutas del admin y la API
│   │   └── wsgi.py
│   └── api/                       # Aplicación API (modelos, serializadores, vistas y URLs)
│       ├── models.py              # Modelo "Item"
│       ├── serializers.py         # Serializador para el modelo
│       ├── views.py               # Vista (ViewSet) para exponer la API
│       ├── urls.py                # Rutas de la API
│       └── admin.py               # Registro del modelo "Item" en el admin
└── frontend/
    ├── Dockerfile.dev             # Dockerfile para el frontend en desarrollo
    ├── Dockerfile.prod            # Dockerfile para producción (Multi-stage con Nginx)
    ├── package.json               # Dependencias de Node (React, Vite, etc.)
    ├── yarn.lock
    ├── vite.config.js             # Configuración de Vite
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # Consumo de la API de Django para listar "Items"
        └── index.css
```

---

## ⚙️ Requisitos Previos

- Tener instalados **Docker** y **Docker Compose**.
- (Opcional) Cliente `psql` o herramientas gráficas como **pgAdmin** o **DBeaver** para interactuar con PostgreSQL.

---

## 🚀 Comandos de Docker

### Levantar el Entorno en Desarrollo

Este entorno usa volúmenes para reflejar cambios en tiempo real.

1. Construir y levantar contenedores (backend, frontend y PostgreSQL):
   ```sh
   docker-compose -f docker-compose.dev.yml up --build
   ```
2. Ver logs del contenedor:
   ```sh
   docker-compose logs backend
   docker-compose logs postgres
   ```
3. Acceder al shell del contenedor:
   ```sh
   docker-compose exec backend bash
   ```
4. Ejecutar migraciones manualmente:
   ```sh
   docker-compose exec backend python manage.py makemigrations
   docker-compose exec backend python manage.py migrate
   ```
5. Para detener contenedores en linux aplica sudo si no tine permiso:
   ```sh
   docker-compose -f docker-compose.dev.yml down
   ```

### Levantar el Entorno en Producción

El entorno en producción usa **Gunicorn** en el backend y **Nginx** para servir el frontend.

1. Construir y levantar contenedores en modo producción:
   ```sh
   docker-compose -f docker-compose.prod.yml up --build
   ```
2. Ver logs del contenedor de producción:
   ```sh
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

---

## 🌍 Acceso a la Aplicación

### Backend (API y Admin)
- **API REST:** [http://localhost:8000/api/items/](http://localhost:8000/api/items/)
- **Panel de Administración:** [http://localhost:8000/admin/](http://localhost:8000/admin/)
  - Para crear un superusuario:
    ```sh
    docker-compose exec backend python manage.py createsuperuser
    ```

### Frontend (React)
- **Modo Desarrollo:** [http://localhost:3000](http://localhost:3000)
- **Modo Producción:** [http://localhost](http://localhost) (servido por Nginx)

---

## 🔹 Notas Adicionales

### CORS
El backend permite peticiones desde `http://localhost:3000` (configurable en `settings.py`).

### Permisos del Script de Entrada
Si encuentras problemas con `entrypoint.sh`, asigna permisos de ejecución:
```sh
chmod +x backend/entrypoint.sh
```

### Control de Versiones
Se recomienda inicializar Git en el proyecto:
```sh
git init
git add .
git commit -m "Plantilla inicial de proyecto full-stack con Docker"
```

---

## 📌 Resumen del Flujo de Trabajo

### Desarrollo:
1. Levantar el entorno:
   ```sh
   docker-compose -f docker-compose.dev.yml up --build
   ```
2. Realizar cambios en el código, el backend y frontend se actualizarán automáticamente.
3. Interactuar con la base de datos mediante `psql` o herramientas gráficas.

### Producción:
1. Levantar el entorno:
   ```sh
   docker-compose -f docker-compose.prod.yml up --build
   ```
2. El backend usa **Gunicorn** y el frontend se sirve mediante **Nginx**.

---

## 🎯 Mejoras Sugeridas

### Seguridad
✅ Usar variables de entorno para credenciales.
✅ Configurar CSRF, CORS y autenticación segura (JWT o sesiones).

### Rendimiento y Escalabilidad
✅ Configurar **Gunicorn** con múltiples workers.
✅ Implementar cache con **Redis**.
✅ Configurar un balanceador de carga si se requiere escalar horizontalmente.

### Mantenimiento y Desarrollo
✅ Implementar pruebas unitarias e integración.
✅ Configurar un pipeline de CI/CD (GitHub Actions, GitLab CI, Jenkins).
✅ Configurar logs centralizados y monitoreo (**ELK Stack**, **Prometheus**, **Grafana**).

### Backups y Recuperación
✅ Automatizar backups de la base de datos.
✅ Documentar y probar los procesos de recuperación ante desastres.

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

📌 Con esta configuración, el proyecto está listo para su desarrollo y despliegue eficiente con Docker. 🚀



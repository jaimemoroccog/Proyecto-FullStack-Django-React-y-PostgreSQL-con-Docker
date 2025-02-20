Proyecto Integrado: Django + React + PostgreSQL con Docker

Este proyecto es una plantilla para desarrollar y desplegar un sistema full-stack utilizando:

- Backend: Django 4.2 con Django Rest Framework para exponer una API REST.
- Frontend: React 18 con Vite para una experiencia rápida de desarrollo.
- Base de Datos: PostgreSQL.
- Contenedores Docker: Se utilizan contenedores para cada componente y Docker Compose para orquestar el entorno.

El proyecto incluye configuraciones separadas para desarrollo y producción.

-------------------------------------------------------------------

Estructura del Proyecto

project/
├── docker-compose.dev.yml         # Configuración de Docker Compose para desarrollo
├── docker-compose.prod.yml        # Configuración de Docker Compose para producción
├── .gitignore
├── README.txt                     # Este archivo
├── backend/
│   ├── Dockerfile                 # Dockerfile para el backend
│   ├── requirements.txt           # Dependencias de Python (incluye Django, DRF, psycopg2, etc.)
│   ├── entrypoint.sh              # Script de entrada que ejecuta migraciones y arranca el servidor
│   ├── manage.py
│   ├── myproject/
│   │   ├── __init__.py
│   │   ├── settings.py            # Configuración general, incluyendo CORS y apps instaladas
│   │   ├── urls.py                # Incluye las rutas del admin y la API
│   │   └── wsgi.py
│   └── api/                       # Aplicación API (modelo, serializer, vistas y URLs)
│       ├── __init__.py
│       ├── models.py              # Modelo "Item"
│       ├── serializers.py         # Serializador para el modelo
│       ├── views.py               # Vista (ViewSet) para exponer la API
│       ├── urls.py                # Rutas de la API
│       └── admin.py               # Registro del modelo "Item" en el admin
└── frontend/
    ├── Dockerfile.dev             # Dockerfile para el frontend en desarrollo
    ├── Dockerfile.prod            # Dockerfile para el frontend en producción (Multi-stage con Nginx)
    ├── package.json               # Dependencias de Node (React, Vite, etc.)
    ├── yarn.lock
    ├── vite.config.js             # Configuración de Vite
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx              # Consumo de la API de Django para listar "Items"
        └── index.css

-------------------------------------------------------------------

Requisitos Previos

- Docker y Docker Compose instalados en tu sistema.
- (Opcional) Cliente psql o alguna herramienta gráfica como pgAdmin o DBeaver para interactuar con PostgreSQL.

-------------------------------------------------------------------

Comandos de Docker

Levantar el Entorno en Desarrollo

Este entorno utiliza montaje de volúmenes para que puedas editar el código y ver los cambios al instante.

1. Construir y levantar contenedores (backend, frontend y PostgreSQL):
   docker-compose -f docker-compose.dev.yml up --build

2. Ver logs del contenedor (por ejemplo, para backend o PostgreSQL):
   docker-compose logs backend
   docker-compose logs postgres

3. Acceder al shell del contenedor (útil para ejecutar comandos de Django):
   docker-compose exec backend bash

4. Ejecutar migraciones manualmente (si es necesario):
   docker-compose exec backend python manage.py makemigrations
   docker-compose exec backend python manage.py migrate

-------------------------------------------------------------------

Levantar el Entorno en Producción

Este entorno está optimizado para producción, utilizando Gunicorn en el backend y Nginx para servir el frontend.

1. Construir y levantar contenedores en modo producción:
   docker-compose -f docker-compose.prod.yml up --build

2. Ver logs del contenedor de producción:
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend

-------------------------------------------------------------------

Acceso a la Aplicación

Backend (API y Admin):
- API REST: http://localhost:8000/api/items/
- Panel de Administración: http://localhost:8000/admin/
  Para crear un superusuario y acceder al admin, ejecuta:
    docker-compose exec backend python manage.py createsuperuser

Frontend (React):
- En desarrollo: http://localhost:3000
- En producción: http://localhost (servido por Nginx)

-------------------------------------------------------------------

Notas Adicionales

- CORS:
  Se ha configurado django-cors-headers para permitir peticiones desde http://localhost:3000.
  Revisa el archivo backend/myproject/settings.py para ajustar la configuración de CORS si es necesario.

- Permisos del Script de Entrada:
  Si encuentras problemas con permisos en entrypoint.sh, asegúrate de asignar permisos de ejecución en el host:
    chmod +x backend/entrypoint.sh

- Control de Versiones:
  Se recomienda inicializar Git en el proyecto:
    git init
    git add .
    git commit -m "Plantilla inicial de proyecto full-stack con Docker"

-------------------------------------------------------------------

Resumen del Flujo

1. Desarrollo:
   - Levanta el entorno con:
       docker-compose -f docker-compose.dev.yml up --build
   - Realiza cambios en el código; el backend y frontend se actualizarán en tiempo real gracias a los volúmenes montados.
   - Utiliza psql o herramientas gráficas para interactuar con PostgreSQL si es necesario.

2. Producción:
   - Levanta el entorno con:
       docker-compose -f docker-compose.prod.yml up --build
   - El backend utiliza Gunicorn y el frontend se sirve a través de Nginx.

Con estos comandos y configuraciones, el proyecto estará listo para desarrollarse y desplegarse de manera eficiente utilizando Docker.


GUIA
========================================================================================================================
SISTEMA FULL-STACK CON DJANGO, REACT Y POSTGRESQL CON DOCKER
========================================================================================================================

1. Introducción y Arquitectura del Sistema
-------------------------------------------
Este proyecto integra tres componentes principales:
  • Backend: Desarrollado en Django 4.2, utilizando Django Rest Framework (DRF) para exponer una API REST.
    - Se ejecuta mediante Gunicorn en producción.
    - Realiza migraciones automáticamente en el entrypoint.
  • Frontend: Aplicación en React 18 con Vite.
    - En modo desarrollo se ejecuta con Vite (hot reload) y en producción se sirve mediante Nginx.
    - La etapa de build genera los archivos estáticos (por defecto en la carpeta "dist") que se copian a Nginx.
  • Base de Datos: PostgreSQL (v15) corriendo en un contenedor Docker.
    - El backend se conecta a PostgreSQL usando variables de entorno para gestionar las credenciales.

Docker Compose orquesta el entorno, con configuraciones separadas para desarrollo y producción.

2. Funcionamiento del Sistema
-----------------------------
- **Backend (Django/DRF):**
  - Administra la lógica de negocio y la persistencia de datos.
  - Expone endpoints (por ejemplo, /api/items/) para operaciones CRUD (GET, POST, PUT, DELETE).
  - Ejecuta migraciones en el entrypoint.sh para garantizar que la base de datos tenga la estructura necesaria.

- **Frontend (React/Vite):**
  - Consume la API REST del backend a través de peticiones HTTP (fetch o axios).
  - En producción, la imagen multi-stage del Dockerfile ejecuta "yarn build", generando la carpeta "dist", la cual se copia a una imagen de Nginx para servir contenido estático.

- **PostgreSQL:**
  - Almacena los datos de la aplicación.
  - Se conecta al backend mediante configuraciones definidas en las variables de entorno.

3. Mejoras Sugeridas para el Proyecto
--------------------------------------
- **Seguridad:**
  • Usar variables de entorno seguras para credenciales y datos sensibles (no hardcodear).
  • Configurar adecuadamente CSRF, CORS, y otros mecanismos de seguridad.
  • Implementar autenticación y autorización (por ejemplo, JWT o sesiones seguras).

- **Rendimiento y Escalabilidad:**
  • Configurar Gunicorn con múltiples workers y ajustar tiempos de espera (timeouts).
  • Considerar la implementación de un balanceador de carga si se requiere escalar horizontalmente.
  • Hacer uso de cache (por ejemplo, Redis) para mejorar tiempos de respuesta.

- **Mantenimiento y Desarrollo:**
  • Implementar pruebas unitarias y de integración para backend y frontend.
  • Configurar un pipeline de CI/CD para despliegue automático (por ejemplo, GitHub Actions, GitLab CI, Jenkins).
  • Configurar logs centralizados y monitoreo (por ejemplo, ELK Stack, Prometheus, Grafana).

- **Backups y Recuperación:**
  • Automatizar backups regulares de la base de datos.
  • Documentar y probar los procesos de recuperación ante desastres.

4. Pasos y Buenas Prácticas para Desplegar en Producción
---------------------------------------------------------
A continuación, una serie de pasos recomendados para subir el proyecto a producción con un nombre de dominio real:

A. Preparación del Dominio y el Servidor
   1. Registrar un dominio (por ejemplo, a través de Namecheap, GoDaddy o Google Domains).
   2. Configurar los registros DNS:
      - Para el frontend (por ejemplo, frontend.tudominio.com), crear un registro A apuntando a la IP de tu servidor.
      - Para el backend (por ejemplo, api.tudominio.com), crear otro registro A con la IP del servidor.
   3. Seleccionar un proveedor VPS o en la nube (DigitalOcean, AWS, Google Cloud, etc.) y configurar el servidor.

B. Configuración del Servidor
   1. Instalar Docker y Docker Compose en el servidor.
   2. Clonar el repositorio del proyecto en el servidor.
   3. Configurar variables de entorno (por ejemplo, en archivos .env) para producción con credenciales seguras.
   4. Ejecutar las migraciones de Django:
         docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

C. Despliegue de la Aplicación
   1. Construir y levantar los contenedores en producción:
         docker-compose -f docker-compose.prod.yml up --build -d
   2. Verificar que los contenedores estén activos y funcionando:
         docker-compose -f docker-compose.prod.yml ps
   3. Revisar logs para detectar cualquier error:
         docker-compose -f docker-compose.prod.yml logs backend
         docker-compose -f docker-compose.prod.yml logs frontend

D. Configuración de Nginx y SSL
   1. Configurar Nginx como proxy inverso para redirigir las peticiones:
      - Configurar un bloque de servidor para el frontend (por ejemplo, frontend.tudominio.com) que sirva los archivos estáticos.
      - Configurar otro bloque para el backend (por ejemplo, api.tudominio.com) que redirija a Gunicorn (proxy_pass http://127.0.0.1:8000).
   2. Instalar Certbot y obtener certificados SSL con Let's Encrypt:
         apt update && apt install certbot python3-certbot-nginx -y
         certbot --nginx -d frontend.tudominio.com -d api.tudominio.com
   3. Configurar la renovación automática de certificados.

E. Monitoreo y Mantenimiento
   1. Configurar monitoreo para vigilar la disponibilidad y el rendimiento (por ejemplo, UptimeRobot, Prometheus, Grafana).
   2. Realizar pruebas de carga y seguridad.
   3. Mantener actualizadas las dependencias y el sistema operativo.
   4. Documentar el proceso de despliegue y tener un plan de recuperación ante incidentes.

5. Conclusión y Recomendaciones Finales
-----------------------------------------
Este sistema es modular y escalable, y está diseñado para facilitar tanto el desarrollo como el despliegue en producción. Algunas recomendaciones adicionales son:

   • Realizar pruebas en un entorno de staging antes de pasar a producción.
   • Automatizar el despliegue mediante scripts o herramientas CI/CD.
   • Revisar periódicamente la configuración de seguridad y rendimiento.
   • Mantener una copia de seguridad regular de la base de datos y otros activos críticos.

Siguiendo estos pasos y buenas prácticas, aumentarás las probabilidades de éxito al subir tu proyecto a un entorno real y asegurarás su estabilidad y seguridad en producción.

============================================================
FIN DE LA GUÍA
============================================================

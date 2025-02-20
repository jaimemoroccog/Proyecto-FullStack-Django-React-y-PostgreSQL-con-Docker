import os
from pathlib import Path

# Estructura de archivos y directorios a crear
structure = [
    # Archivos raíz
    'docker-compose.dev.yml',
    'docker-compose.prod.yml',
    '.gitignore',
    
    # Backend
    'backend/Dockerfile',
    'backend/requirements.txt',
    'backend/entrypoint.sh',
    'backend/manage.py',
    'backend/myproject/__init__.py',
    'backend/myproject/settings.py',
    'backend/myproject/urls.py',
    'backend/myproject/wsgi.py',
    
    # Frontend
    'frontend/Dockerfile.dev',
    'frontend/Dockerfile.prod',
    'frontend/package.json',
    'frontend/yarn.lock',
    'frontend/vite.config.js',
    'frontend/index.html',
    'frontend/src/main.jsx',
    'frontend/src/App.jsx',
    'frontend/src/index.css'
]

def create_structure():
    for path in structure:
        file_path = Path(path)
        # Crear directorios padres si no existen
        file_path.parent.mkdir(parents=True, exist_ok=True)
        # Crear archivo vacío
        file_path.touch()
        
    print("Estructura creada exitosamente!")

if __name__ == '__main__':
    create_structure()
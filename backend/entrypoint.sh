#!/bin/sh

echo "Esperando a que Postgres esté disponible en $DATABASE_HOST:$DATABASE_PORT..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
    sleep 1
done
echo "Postgres está disponible, continuando..."

# Detectar aplicaciones con modelos y aplicar migraciones solo a ellas
APPS=$(python manage.py showmigrations | grep '\[ \]' | awk '{print $1}' | sort -u)

if [ -n "$APPS" ]; then
    for app in $APPS; do
        echo "Generando migraciones para $app..."
        python manage.py makemigrations $app --noinput
    done
else
    echo "No hay migraciones pendientes."
fi

python manage.py migrate --noinput

if [ "$DEBUG" = "1" ]; then
    echo "Ejecutando en modo desarrollo"
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Ejecutando en modo producción"
    exec gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
fi


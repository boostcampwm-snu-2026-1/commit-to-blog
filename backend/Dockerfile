FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

COPY alembic.ini ./
COPY alembic ./alembic
COPY scripts ./scripts
COPY app ./app

EXPOSE 8000
CMD ["sh", "-c", "sh scripts/run_migrations.sh && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

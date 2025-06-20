# Use the official PostgreSQL 12 image as the base
# This ensures you benefit from the optimizations and security of the official image.
FROM postgres:12

# === Optional: Install additional PostgreSQL extensions ===
# This section demonstrates how to install a hypothetical extension.
# Replace 'your_extension_dev' and 'your_extension' with actual packages.
# You might need to find the specific development packages for your desired extension.
# This example uses 'pg_trgm' as a common extension.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     postgresql-server-dev-12 \
#     && rm -rf /var/lib/apt/lists/*
# RUN echo "shared_preload_libraries = 'pg_stat_statements'" >> /usr/local/share/postgresql/postgresql.conf.sample
# For common extensions that are part of the `contrib` package, you usually don't need to install `postgresql-server-dev-12`
# if they are already compiled into the base image.
# Example for pg_trgm (often already available via CREATE EXTENSION)
# RUN apt-get update && apt-get install -y postgresql-contrib-12 && rm -rf /var/lib/apt/lists/*

# === Optional: Copy initial SQL scripts or data ===
# The official PostgreSQL image has an /docker-entrypoint-initdb.d/ directory.
# Any .sh, .sql, or .sql.gz files placed here will be executed alphabetically
# when the container is first created and the database is initialized.
# COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Example of an init-script file (e.g., init-scripts/01-create-db.sql):
# CREATE DATABASE my_app_db;
# \c my_app_db
# CREATE USER myuser WITH PASSWORD 'mypassword';
# GRANT ALL PRIVILEGES ON DATABASE my_app_db TO myuser;
#
# Example of another init-script file (e.g., init-scripts/02-create-tables.sql):
# \c my_app_db
# CREATE TABLE IF NOT EXISTS users (
#     id SERIAL PRIMARY KEY,
#     name VARCHAR(100) NOT NULL,
#     email VARCHAR(100) UNIQUE NOT NULL
# );

# === Optional: Apply custom postgresql.conf settings ===
# While environment variables (like POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD)
# are generally preferred for basic configuration, you can also copy a custom config file.
# Note: This will replace the default postgresql.conf. You might want to merge instead.
# COPY ./postgresql.conf /etc/postgresql/postgresql.conf

# === Optional: Set environment variables (less common to hardcode here, usually passed at runtime) ===
# ENV POSTGRES_DB my_app_db
# ENV POSTGRES_USER myuser
# ENV POSTGRES_PASSWORD mypassword

# Expose the default PostgreSQL port
# This is usually already handled by the base image, but good for clarity.
EXPOSE 5432

# The CMD is inherited from the base image and runs the PostgreSQL server.
# No need to specify CMD here unless you have a very specific entrypoint change.
# CMD ["postgres"]
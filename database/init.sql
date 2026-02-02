CREATE TABLE IF NOT EXISTS lecturas (
    id_lectura UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id VARCHAR(50) NOT NULL,
    tipo_sensor VARCHAR(50) NOT NULL,
    valor NUMERIC(8,2) NOT NULL,
    unidad VARCHAR(10),
    timestamp TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA SENSORES
-- =========================
CREATE TABLE IF NOT EXISTS sensores (
    id SERIAL PRIMARY KEY,
    codigo_sensor VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    unidad VARCHAR(10) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA ALERTAS (FUTURO)
-- =========================
CREATE TABLE IF NOT EXISTS alertas (
    id_alerta UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id VARCHAR(50) NOT NULL,
    valor NUMERIC(8,2) NOT NULL,
    umbral NUMERIC(8,2) NOT NULL,
    tipo_alerta VARCHAR(20) NOT NULL, -- 'ALTA' | 'BAJA'
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS umbrales (
    id_umbral SERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) NOT NULL,
    tipo_sensor VARCHAR(50) NOT NULL,
    operador VARCHAR(5) NOT NULL,
    umbral NUMERIC(8,2) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sensor_id, tipo_sensor)
);


CREATE EXTENSION IF NOT EXISTS "pgcrypto";


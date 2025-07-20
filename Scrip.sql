create database TRAKING_PAQUETES

CREATE TABLE clientes (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    empresa VARCHAR(100),
    fecha_registro DATETIME DEFAULT GETDATE() NOT NULL
);
go

CREATE TABLE agentes_aduanales (
    id_agente INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    empresa VARCHAR(100),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100) UNIQUE,
    pais VARCHAR(50)
);
go

CREATE TABLE casetas (
    id_caseta INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    tipo VARCHAR(50) -- Ej: 'aduana', 'peaje', 'centro logístico'
);
go

CREATE TABLE estados (
    id_estado INT IDENTITY(1,1) PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);
go

CREATE TABLE envios (
    id_envio INT IDENTITY(1,1) PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_agente INT,
    numero_guia VARCHAR(50) UNIQUE NOT NULL,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    estado_actual INT NOT NULL,
    fecha_registro DATETIME DEFAULT GETDATE() NOT NULL,
    ultima_actualizacion DATETIME DEFAULT GETDATE() NOT NULL,
    CONSTRAINT fk_envios_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_envios_agentes FOREIGN KEY (id_agente) REFERENCES agentes_aduanales(id_agente),
    CONSTRAINT fk_envios_estados FOREIGN KEY (estado_actual) REFERENCES estados(id_estado)
);
go

CREATE TABLE historial_estados (
    id_historial INT IDENTITY(1,1) PRIMARY KEY,
    id_envio INT NOT NULL,
    id_estado INT NOT NULL,
    id_caseta INT,
    fecha_cambio DATETIME DEFAULT GETDATE() NOT NULL,
    ubicacion VARCHAR(100),
    CONSTRAINT fk_historial_envios FOREIGN KEY (id_envio) REFERENCES envios(id_envio),
    CONSTRAINT fk_historial_estados FOREIGN KEY (id_estado) REFERENCES estados(id_estado),
    CONSTRAINT fk_historial_casetas FOREIGN KEY (id_caseta) REFERENCES casetas(id_caseta)
);
go

CREATE TABLE notificaciones (
    id_notificacion INT IDENTITY(1,1) PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_envio INT NOT NULL,
    mensaje VARCHAR(500) NOT NULL,
    tipo VARCHAR(20) NOT NULL, 
    fecha_envio DATETIME DEFAULT GETDATE() NOT NULL,
    estado VARCHAR(20) DEFAULT 'enviado', 
    CONSTRAINT fk_notificaciones_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_notificaciones_envios FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
);
go
CREATE TABLE web_tracking_logs (
    id_log INT IDENTITY(1,1) PRIMARY KEY,
    numero_guia VARCHAR(50) NOT NULL,
    ip_cliente VARCHAR(45), 
    user_agent VARCHAR(500),
    fecha_consulta DATETIME DEFAULT GETDATE() NOT NULL,
    CONSTRAINT fk_logs_envios FOREIGN KEY (numero_guia) REFERENCES envios(numero_guia)
);
go

CREATE INDEX idx_clientes_correo ON clientes(correo_electronico);
CREATE INDEX idx_envios_numero_guia ON envios(numero_guia);
CREATE INDEX idx_logs_fecha_consulta ON web_tracking_logs(fecha_consulta);
CREATE INDEX idx_historial_envio ON historial_estados(id_envio);


INSERT INTO estados (nombre_estado, descripcion) VALUES ('En preparación', 'El paquete está siendo preparado para envío.');
INSERT INTO estados (nombre_estado, descripcion) VALUES ('En tránsito', 'El paquete está en camino.');
INSERT INTO estados (nombre_estado, descripcion) VALUES ('En caseta', 'El paquete está en una caseta de control.');
INSERT INTO estados (nombre_estado, descripcion) VALUES ('En aduana', 'El paquete está en revisión aduanal.');
INSERT INTO estados (nombre_estado, descripcion) VALUES ('Entregado', 'El paquete ha sido entregado.');
go

INSERT INTO clientes (nombre, correo_electronico, telefono, empresa, fecha_registro)
VALUES 
    ('Juan Pérez', 'juan.perez@correo.com', '6641234567', 'Logística Tijuana SA', GETDATE()),
    ('María López', 'maria.lopez@correo.com', '6649876543', 'Envíos Rápidos MX', GETDATE()),
    ('Carlos Gómez', 'carlos.gomez@correo.com', '6645551234', NULL, GETDATE());
    go

INSERT INTO agentes_aduanales (nombre, empresa, telefono, correo_electronico, pais)
VALUES 
    ('Ana Ramírez', 'Aduanas Tijuana', '6641112233', 'ana.ramirez@aduanas.com', 'México'),
    ('Luis Fernández', 'Global Customs', '6644445566', 'luis.fernandez@global.com', 'México');
    go

INSERT INTO casetas (nombre, latitud, longitud, tipo)
VALUES 
    ('Caseta Tijuana-Tecate', 32.5667, -116.6667, 'peaje'), 
    ('Caseta Tijuana-Ensenada', 32.5333, -117.0333, 'peaje'), 
    ('Centro Logístico Tijuana', 32.5149, -117.0382, 'centro logístico'),
    ('Aduana Otay', 32.5530, -116.9390, 'aduana'), 
    ('Caseta Rosarito', 32.3607, -117.0558, 'peaje');

    go
INSERT INTO envios (id_cliente, id_agente, numero_guia, origen, destino, estado_actual, fecha_registro, ultima_actualizacion)
VALUES 
    (1, 1, 'TJ20250001', 'Tijuana, BC', 'Ciudad de México, CDMX', 1, GETDATE(), GETDATE()),
    (2, 2, 'TJ20250002', 'Tijuana, BC', 'Guadalajara, JAL', 2, GETDATE(), GETDATE()),
    (3, NULL, 'TJ20250003', 'Tijuana, BC', 'Ensenada, BC', 3, GETDATE(), GETDATE());
    go

INSERT INTO historial_estados (id_envio, id_estado, id_caseta, fecha_cambio, ubicacion)
VALUES 
    (1, 1, NULL, DATEADD(MINUTE, -120, GETDATE()), 'Tijuana, BC'), 
    (1, 2, 1, DATEADD(MINUTE, -60, GETDATE()), 'Caseta Tijuana-Tecate'),
    (2, 2, 2, DATEADD(MINUTE, -90, GETDATE()), 'Caseta Tijuana-Ensenada'), 
    (2, 3, 4, GETDATE(), 'Aduana Otay'),
    (3, 3, 5, DATEADD(MINUTE, -30, GETDATE()), 'Caseta Rosarito'),
    (3, 4, 4, GETDATE(), 'Aduana Otay'); 
    go


INSERT INTO notificaciones (id_cliente, id_envio, mensaje, tipo, fecha_envio, estado)
VALUES 
    (1, 1, 'Su paquete TJ20250001 está en la Caseta Tijuana-Tecate.', 'email', GETDATE(), 'enviado'),
    (2, 2, 'Su paquete TJ20250002 ha llegado a la Aduana Otay.', 'SMS', GETDATE(), 'enviado'),
    (3, 3, 'Su paquete TJ20250003 está en proceso de revisión aduanal.', 'push', GETDATE(), 'leído');
    go


INSERT INTO web_tracking_logs (numero_guia, ip_cliente, user_agent, fecha_consulta)
VALUES 
    ('TJ20250001', '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124', DATEADD(MINUTE, -10, GETDATE())),
    ('TJ20250002', '172.16.0.5', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) Safari/604.1', DATEADD(MINUTE, -5, GETDATE())),
    ('TJ20250003', '10.0.0.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/89.0', GETDATE());
    go
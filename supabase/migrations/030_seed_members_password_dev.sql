-- Contraseña de prueba para usuario dev: "dev"
-- Solo para desarrollo local. En producción los miembros configuran su contraseña.
UPDATE members SET password_hash = '$2b$10$G8rPuQxOHVRxHENmtlunjOxQKmffdUyJAVUVaVhJ12GtzD43oRFrG'
WHERE phone = 'dev' AND password_hash IS NULL;

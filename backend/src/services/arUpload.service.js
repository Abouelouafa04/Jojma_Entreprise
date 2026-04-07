import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

export function buildFileUrl(req, filePath) {
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
}

export function buildPublicFileUrl(req, filePath) {
  const requestHost = req.get("host") || `localhost:${process.env.PORT || 5000}`;
  const requestScheme = req.protocol || "http";
  const normalizedPath = filePath.replace(/\\/g, "/");

  if (requestHost.includes("localhost") || requestHost.includes("127.0.0.1")) {
    const localIP = getLocalIP();
    if (localIP) {
      const port = requestHost.split(":")[1] || process.env.PORT || 5000;
      return `http://${localIP}:${port}/${normalizedPath}`;
    }
  }

  return `${requestScheme}://${requestHost}/${normalizedPath}`;
}

export function formatARUploadResponse(req, file, platform) {
  return {
    success: true,
    platform,
    originalName: file.originalname,
    savedName: file.filename,
    fileUrl: buildFileUrl(req, `uploads/ar/${file.filename}`),
    publicUrl: buildPublicFileUrl(req, `uploads/ar/${file.filename}`),
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
  };
}

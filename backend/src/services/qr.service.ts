import QRCode from 'qrcode';

export const generateQRCodeBase64 = async (url: string): Promise<string> => {
  try {
    const qrData = await QRCode.toDataURL(url, {
      color: {
        dark: '#1a3683',
        light: '#ffffff'
      },
      width: 512,
      margin: 2
    });
    return qrData;
  } catch (err) {
    console.error('Erreur génération QR Code:', err);
    throw err;
  }
};

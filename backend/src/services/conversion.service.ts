import Model3D from '../modules/models3d/model3d.model';

interface ConversionResult {
  success: boolean;
  filename: string;
  original_filename: string;
  output_url: string;
  source_format: string;
  target_format: string;
  timestamp: Date;
  duration: number;
}

/**
 * Logs conversion process and updates model status in database
 */
export const logConversion = async (modelId: string, result: ConversionResult) => {
  try {
    const model = await Model3D.findByPk(modelId);
    if (!model) {
      console.warn(`[Conversion] Modèle non trouvé : ${modelId}`);
      return;
    }

    console.log(`[Conversion] Succès pour : ${model.name}`);
    console.log(`[Conversion] Fichier converti : ${result.filename}`);
    console.log(`[Conversion] Durée : ${result.duration}ms`);
    console.log(`[Conversion] Format : ${result.source_format} → ${result.target_format}`);

    // Update model with conversion result
    await model.update({
      status: 'completed',
      convertedFormat: result.target_format,
      convertedFileName: result.filename,
      conversionDate: new Date(),
    });

  } catch (error) {
    console.error(`[Conversion] Erreur lors de la journalisation :`, error);
    throw error;
  }
};

/**
 * Handles conversion error and updates model status
 */
export const handleConversionError = async (modelId: string, error: Error) => {
  try {
    const model = await Model3D.findByPk(modelId);
    if (!model) {
      console.error(`[Conversion] Modèle non trouvé : ${modelId}`);
      return;
    }

    console.error(`[Conversion] Échec pour : ${model.name}`);
    console.error(`[Conversion] Erreur :`, error.message);

    await model.update({
      status: 'error',
      errorMessage: error.message,
    });

  } catch (updateError) {
    console.error(`[Conversion] Erreur lors de la mise à jour du statut :`, updateError);
  }
};

/**
 * Validates conversion parameters
 */
export const validateConversionParams = (sourceFormat: string, targetFormat: string): boolean => {
  const supportedFormats = ['STL', 'OBJ', 'FBX', 'PLY', 'GLB', 'USDZ', 'DAE', 'ABC'];
  
  if (!supportedFormats.includes(sourceFormat.toUpperCase())) {
    throw new Error(`Format source non supporté : ${sourceFormat}`);
  }
  
  if (!supportedFormats.includes(targetFormat.toUpperCase())) {
    throw new Error(`Format cible non supporté : ${targetFormat}`);
  }
  
  if (sourceFormat.toUpperCase() === targetFormat.toUpperCase()) {
    throw new Error('Les formats source et cible sont identiques');
  }
  
  return true;
};

import { useMemo, useRef, useState, ChangeEvent } from "react";
import { RefreshCw, ChevronDown, Upload } from "lucide-react";
import {
  convert3DFile,
  getFileUrl,
  Convert3DFileResponse,
  createConversionJob,
} from "../api/api";
import "../styles/conversion.css";
import { useNavigate } from "react-router-dom";

const FORMATS: string[] = [
  "STL",
  "OBJ",
  "FBX",
  "PLY",
  "GLB",
  "USDZ",
  "DAE",
  "ABC",
];

export default function ConversionSystem() {
  const [sourceFormat, setSourceFormat] = useState<string>("STL");
  const [targetFormat, setTargetFormat] = useState<string>("GLB");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<Convert3DFileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const originalFileLabel = useMemo<string>(() => {
    return selectedFile ? selectedFile.name : "Aucun fichier sélectionné";
  }, [selectedFile]);

  const convertedFileLabel = useMemo<string>(() => {
    return convertedFile ? convertedFile.filename : "Aucun fichier converti";
  }, [convertedFile]);

  const handleSwapFormats = (): void => {
    setSourceFormat(targetFormat);
    setTargetFormat(sourceFormat);
    setConvertedFile(null);
    setErrorMessage("");
  };

  const handleChooseFile = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setConvertedFile(null);
    setErrorMessage("");
  };

  const handleConvert = async (): Promise<void> => {
    if (!selectedFile) {
      setErrorMessage("Veuillez sélectionner un fichier avant la conversion.");
      return;
    }

    if (sourceFormat === targetFormat) {
      setErrorMessage("Le format source et cible sont identiques.");
      return;
    }

    const fileExtension = selectedFile.name.split('.').pop()?.toUpperCase();
    if (fileExtension !== sourceFormat) {
      setErrorMessage(`Le fichier sélectionné ne correspond pas au format source (${sourceFormat}).`);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setConvertedFile(null);

    try {
      const token = localStorage.getItem('jojma_token');

      // Pro workflow: if user is logged-in, create a job and go to pipeline.
      if (token) {
        const job = await createConversionJob({
          file: selectedFile,
          sourceFormat,
          targetFormat,
        });

        // Redirect to pipeline and focus the new job.
        navigate(`/dashboard/conversions?job=${encodeURIComponent(job.id)}`);
        return;
      }

      // Public fallback: immediate conversion (no pipeline tracking)
      const result = await convert3DFile({ file: selectedFile, sourceFormat, targetFormat });
      setConvertedFile(result);

      // Even in public mode, send user to the pipeline screen.
      // If the user is not authenticated, ProtectedRoute will redirect to /login
      // and then bring them back to the pipeline after login.
      navigate('/dashboard/conversions');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="conversion-section">
      <div className="conversion-container">
        <h1 className="conversion-title">Système de Conversion</h1>
        <p className="text-center text-slate-500 text-sm font-medium mt-2 mb-8">
          Seuls ces Formats sont actuellement pris en charge(GLB / STL / USDZ).
        </p>

        <div className="conversion-toolbar">
          <div className="format-select-wrapper">
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value)}
              className="format-select"
            >
              {FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="select-icon" />
          </div>

          <button
            type="button"
            className="swap-button"
            onClick={handleSwapFormats}
            aria-label="Inverser les formats"
          >
            <RefreshCw size={20} />
          </button>

          <div className="format-select-wrapper">
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="format-select"
            >
              {FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="select-icon" />
          </div>
        </div>

        <div className="conversion-actions">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden-input"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="action-button"
            onClick={handleChooseFile}
          >
            <Upload size={18} />
            Choisir un fichier
          </button>

          <button
            type="button"
            className="action-button"
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? "Conversion..." : "Convertir"}
          </button>
        </div>

        {errorMessage && <div className="conversion-error">{errorMessage}</div>}

        <div className="preview-grid">
          <div className="preview-block">
            <h2 className="preview-title">Fichier Original ({sourceFormat})</h2>
            <div className="preview-card">
              <div className="preview-content">
                <p>{originalFileLabel}</p>
              </div>
            </div>
          </div>

          <div className="preview-block">
            <h2 className="preview-title">Fichier Converti ({targetFormat})</h2>
            <div className="preview-card">
              <div className="preview-content">
                <p>{convertedFileLabel}</p>

                {!!localStorage.getItem('jojma_token') && (
                  <p className="text-xs text-slate-500 mt-2">
                    Vous êtes connecté: la conversion est envoyée au pipeline (suivi, relance, historique).
                  </p>
                )}

                {convertedFile?.output_url && (
                  <a
                    href={getFileUrl(convertedFile.output_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="download-link"
                  >
                    Télécharger le fichier converti
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

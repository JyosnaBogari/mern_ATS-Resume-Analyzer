import { useState } from "react";
import { saveAs } from "file-saver";
import LoadingSpinner from "./LoadingSpinner";

function DownloadButton({
  resumeId,
  fileName = "resume.pdf",
  className = "",
  label = "Download",
  onDownload,
  source = "current",
  disabled = false,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFromServer = async () => {
    if (!resumeId) return;

    const query = source ? `?source=${source}` : "";
    const response = await fetch(
      `http://localhost:3000/resume-api/download/${resumeId}${query}`,
      { credentials: "include" }
    );

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    saveAs(blob, fileName);
  };

  const handleDownload = async () => {
    if (isDownloading || disabled || !resumeId) return;

    try {
      setIsDownloading(true);
      if (onDownload) {
        await onDownload();
      } else {
        await downloadFromServer();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to download resume.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || disabled || !resumeId}
      title="Download PDF"
      aria-label="Download PDF"
      className={`inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isDownloading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="material-symbols-outlined text-base">download</span>
          <span>{label}</span>
        </span>
      )}
    </button>
  );
}

export default DownloadButton;
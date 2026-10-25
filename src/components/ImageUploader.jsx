import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Calendar,
  X,
  RefreshCw,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ImageUploader({
  label = 'Satellite Image',
  section = 'A', // 'A' or 'B'
  imageData,
  fileName,
  fileSize,
  selectedDate,
  onImageChange,
  onDateChange,
  onRemove,
  defaultDate = '2021-01-01',
  isLoading = false
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  const validateAndProcessFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    if (!supportedTypes.includes(file.type)) {
      setErrorMessage(`Unsupported format "${file.type || 'unknown'}". Please upload PNG, JPG, JPEG, or WEBP.`);
      return;
    }

    // Limit size to 15MB for responsive browser canvas processing
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB. Please upload an image under 15MB for optimal browser performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        onImageChange({
          dataUrl,
          name: file.name,
          size: formatBytes(file.size),
          originalDimensions: `${img.naturalWidth} × ${img.naturalHeight} px`,
          isDemo: false,
        });
      };
      img.onerror = () => {
        onImageChange({
          dataUrl,
          name: file.name,
          size: formatBytes(file.size),
          originalDimensions: 'Not provided',
          isDemo: false,
        });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="card" style={styles.cardContainer}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.headerTitleGroup}>
          <span style={styles.sectionBadge}>
            SECTION {section}
          </span>
          <h3 style={styles.cardTitle}>{label}</h3>
        </div>

        {imageData && (
          <div style={styles.headerActions}>
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="btn btn-secondary btn-sm"
              title="Replace this image"
            >
              <RefreshCw size={13} />
              <span>Replace</span>
            </button>
            <button
              onClick={onRemove}
              className="btn btn-ghost btn-sm"
              style={{ color: '#f87171' }}
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Date Picker Input */}
      <div style={styles.datePickerRow}>
        <Calendar size={15} color="var(--emerald-400)" />
        <span style={styles.dateLabel}>Acquisition Date:</span>
        <input
          type="date"
          value={selectedDate || defaultDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      {/* Upload Drop Zone or Image Preview */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".png,.jpg,.jpeg,.webp"
        style={{ display: 'none' }}
      />

      {imageData ? (
        <div style={styles.previewContainer}>
          <img src={imageData} alt={label} style={styles.previewImage} />
          <div style={styles.previewOverlay}>
            <div style={styles.previewMetaRow}>
              <div style={styles.fileNameBadge} title={fileName}>
                <FileCheck size={13} color="var(--emerald-400)" />
                <span style={styles.fileNameText}>{fileName || 'satellite_tile.jpg'}</span>
              </div>
              {fileSize && (
                <span className="badge badge-slate" style={{ fontSize: '0.68rem' }}>
                  {fileSize}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneActive : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <div style={styles.uploadIconBox}>
            <UploadCloud size={28} color={isDragging ? 'var(--emerald-400)' : 'var(--text-secondary)'} />
          </div>
          <div style={styles.dropZoneText}>
            <span style={{ fontWeight: 600, color: '#ffffff' }}>Click to browse</span> or drag & drop
          </div>
          <div style={styles.dropZoneSubtext}>
            PNG, JPG, JPEG, or WEBP (Standard Optical / Aerial passes)
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {errorMessage && (
        <div style={styles.errorAlert}>
          <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading State Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div className="radar-dot" />
          <span>Calibrating spectral raster...</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '18px 20px',
    position: 'relative'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  sectionBadge: {
    fontSize: '0.66rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    padding: '3px 7px',
    borderRadius: '4px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--emerald-400)',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  cardTitle: {
    fontSize: '0.96rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  datePickerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(6, 11, 20, 0.5)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)'
  },
  dateLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)'
  },
  dateInput: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
    cursor: 'pointer'
  },
  dropZone: {
    height: '210px',
    border: '2px dashed var(--border-medium)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    backgroundColor: 'rgba(6, 11, 20, 0.4)',
    transition: 'all 0.2s ease',
    padding: '16px',
    textAlign: 'center'
  },
  dropZoneActive: {
    borderColor: 'var(--emerald-400)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)'
  },
  uploadIconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2px'
  },
  dropZoneText: {
    fontSize: '0.86rem',
    color: 'var(--text-secondary)'
  },
  dropZoneSubtext: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  previewContainer: {
    position: 'relative',
    height: '210px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    backgroundColor: '#000000'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px 12px',
    background: 'linear-gradient(to top, rgba(6, 11, 20, 0.95) 0%, transparent 100%)'
  },
  previewMetaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  fileNameBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflow: 'hidden',
    maxWidth: '70%'
  },
  fileNameText: {
    fontSize: '0.74rem',
    color: '#ffffff',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    fontSize: '0.76rem'
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(6, 11, 20, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.82rem',
    color: 'var(--emerald-400)',
    zIndex: 10
  }
};

import { useState, useRef, useEffect } from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import styles from "./file-viewer.module.css";

function PdfViewer({ fileUrl, label }) {
    const [reloadKey, setReloadKey] = useState(0);
    const hasAutoReloaded = useRef(false);

    const viewerSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    useEffect(() => {
        hasAutoReloaded.current = false;
    }, [fileUrl]);

    const handleLoad = (e) => {
        if (hasAutoReloaded.current) return;
        const timer = setTimeout(() => {
            try {
                const doc = e.target.contentDocument;
                const isEmpty = !doc || !doc.body || doc.body.innerHTML.trim().length < 100;
                if (isEmpty) {
                    hasAutoReloaded.current = true;
                    setReloadKey((k) => k + 1);
                }
            } catch {
                // Cross-origin throw means Google loaded content successfully
            }
        }, 2000);
        return () => clearTimeout(timer);
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>{label}</p>
            <iframe
                key={reloadKey}
                src={viewerSrc}
                className={styles.pdfFrame}
                title={label}
                onLoad={handleLoad}
            />
            <div className={styles.pdfActions}>
                <button
                    className={styles.reloadBtn}
                    onClick={() => {
                        hasAutoReloaded.current = false;
                        setReloadKey((k) => k + 1);
                    }}
                >
                    <RefreshCw size={13} strokeWidth={1.75} />
                    Reload preview
                </button>
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openBtn}
                >
                    <Download size={13} strokeWidth={1.75} />
                    Download PDF
                </a>
            </div>
        </div>
    );
}

export default function FileViewer({ fileUrl, fileType, label = "Attached File" }) {
    if (!fileUrl || !fileType) return null;

    if (fileType === "pdf") {
        return <PdfViewer fileUrl={fileUrl} label={label} />;
    }

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>{label}</p>
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
            >
                <FileText size={18} strokeWidth={1.75} />
                <span>Download {fileType.toUpperCase()} file</span>
                <Download size={15} strokeWidth={1.75} className={styles.downloadIcon} />
            </a>
        </div>
    );
}
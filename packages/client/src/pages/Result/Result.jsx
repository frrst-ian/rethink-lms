import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import useSubmissionResult from "../../hooks/Submission/useSubmissionResult";
import FileViewer from "../../components/FileViewer/FileViewer";
import styles from "./result.module.css";

export default function Result() {
    const navigate = useNavigate();
    const location = useLocation();

    // If navigated from submit, result is in state — otherwise fetch it
    const stateResult = location.state?.result;
    const { result: fetched, loading, error } = useSubmissionResult();

    if (loading && !stateResult) return <div className="loading">Loading...</div>;
    if (error) return <div className="loading">{error}</div>;

    const submission = stateResult?.submission ?? fetched;
    const aiPct = stateResult?.ai_percentage ?? fetched?.result?.ai_percentage;
    const humanPct = stateResult?.human_percentage ?? (aiPct != null ? parseFloat((100 - aiPct).toFixed(2)) : null);
    const isFlagged = stateResult?.isFlagged ?? fetched?.result?.isFlagged;
    const skipped = stateResult?.skipped ?? (fetched && !fetched.result);
    const suggestion = fetched?.result?.suggestion?.content ?? null;

    if (!submission) return <div className="loading">No submission found.</div>;

    return (
        <div className={styles.wrapper}>
            <button className={styles.back} onClick={() => navigate(-1)}>
                <ChevronLeft size={16} strokeWidth={1.75} />
                Back
            </button>

            <div className={styles.header}>
                <h2 className={styles.title}>Submission Result</h2>
                <p className={styles.sub}>
                    Submitted on{" "}
                    {new Date(submission.submittedAt).toLocaleDateString(undefined, {
                        month: "long", day: "numeric", year: "numeric",
                    })}
                </p>
            </div>

            <div className={styles.card}>
                <p className={styles.cardLabel}>AI Detection</p>

                {skipped ? (
                    <div className={styles.skippedBadge}>
                        <Clock size={15} strokeWidth={1.75} />
                        Too short to analyze — minimum 100 words required
                    </div>
                ) : (
                    <>
                        <div className={styles.flagRow}>
                            {isFlagged ? (
                                <span className={styles.flaggedBadge}>
                                    <AlertTriangle size={14} strokeWidth={1.75} />
                                    Flagged as AI-Generated
                                </span>
                            ) : (
                                <span className={styles.cleanBadge}>
                                    <ShieldCheck size={14} strokeWidth={1.75} />
                                    Looks Human-Written
                                </span>
                            )}
                        </div>

                        {aiPct != null && (
                            <div className={styles.bars}>
                                <div className={styles.barRow}>
                                    <span className={styles.barLabel}>AI</span>
                                    <div className={styles.barTrack}>
                                        <div
                                            className={`${styles.barFill} ${styles.aiFill}`}
                                            style={{ width: `${aiPct}%` }}
                                        />
                                    </div>
                                    <span className={styles.barPct}>{aiPct}%</span>
                                </div>
                                <div className={styles.barRow}>
                                    <span className={styles.barLabel}>Human</span>
                                    <div className={styles.barTrack}>
                                        <div
                                            className={`${styles.barFill} ${styles.humanFill}`}
                                            style={{ width: `${humanPct}%` }}
                                        />
                                    </div>
                                    <span className={styles.barPct}>{humanPct}%</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {suggestion && (
                <div className={`${styles.card} ${styles.suggestionCard}`}>
                    <p className={styles.cardLabel}>Feedback</p>
                    <p className={styles.suggestionText}>{suggestion}</p>
                </div>
            )}

            {submission.fileUrl && (
                <div className={styles.card}>
                    <FileViewer
                        fileUrl={submission.fileUrl}
                        fileType={submission.fileType}
                        label="Your Submitted File"
                    />
                </div>
            )}

            {submission.content && (
                <div className={styles.card}>
                    <p className={styles.cardLabel}>Your Written Response</p>
                    <p className={styles.content}>{submission.content}</p>
                </div>
            )}
        </div>
    );
}
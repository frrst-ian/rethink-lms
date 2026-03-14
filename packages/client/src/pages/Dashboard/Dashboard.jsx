import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useDashboard from "../../hooks/Dashboard/useDashboard";
import {
    RadialBarChart, RadialBar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { AlertTriangle, CalendarClock, BookOpen, ClipboardList, Users, TrendingUp } from "lucide-react";
import styles from "./dashboard.module.css";

const FLAG_THRESHOLD = 40;

function StatCard({ label, value, icon: Icon, accent }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statTop}>
                <span className={styles.statLabel}>{label}</span>
                <Icon size={16} strokeWidth={1.75} className={styles.statIcon} style={{ color: accent }} />
            </div>
            <p className={styles.statValue} style={{ color: accent }}>{value ?? "—"}</p>
        </div>
    );
}

function AiGauge({ percentage }) {
    const value = percentage ?? 0;
    return (
        <div className={styles.gaugeWrapper}>
            <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                    cx="50%" cy="80%"
                    innerRadius="70%" outerRadius="100%"
                    startAngle={180} endAngle={0}
                    data={[{ value: 100, fill: "#2a2840" }, { value, fill: value > FLAG_THRESHOLD ? "#ef517a" : "#4caf82" }]}
                    barSize={14}
                >
                    <RadialBar dataKey="value" background={false} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className={styles.gaugeCenter}>
                <p className={styles.gaugeValue} style={{ color: value > FLAG_THRESHOLD ? "#ef517a" : "#4caf82" }}>
                    {percentage != null ? `${percentage}%` : "N/A"}
                </p>
                <p className={styles.gaugeLabel}>Avg AI</p>
            </div>
        </div>
    );
}

function FlagPieChart({ flagged, total }) {
    const clean = total - flagged;
    const data = [
        { name: "Flagged", value: flagged },
        { name: "Clean", value: clean },
    ];
    return (
        <ResponsiveContainer width="100%" height={140}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                    <Cell fill="#ef517a" />
                    <Cell fill="#4caf82" />
                </Pie>
                <Tooltip
                    contentStyle={{ background: "var(--s-background)", border: "1px solid #2a2840", borderRadius: "0.45rem", fontSize: "0.78rem" }}
                    itemStyle={{ color: "var(--text2)" }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className={styles.chartTooltip}>
            <p className={styles.tooltipWeek}>Week of {label}</p>
            <p className={styles.tooltipValue} style={{ color: payload[0].value > FLAG_THRESHOLD ? "#ef517a" : "#4caf82" }}>
                {payload[0].value}% avg AI
            </p>
            <p className={styles.tooltipCount}>{payload[1]?.value ?? 0} submissions</p>
        </div>
    );
};

function TrendChart({ data }) {
    if (!data?.length) return <p className={styles.empty}>Not enough data yet.</p>;

    const formatted = data.map((d) => ({
        ...d,
        weekLabel: new Date(d.week).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={formatted} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2840" vertical={false} />
                <XAxis
                    dataKey="weekLabel"
                    tick={{ fill: "#8391ac", fontSize: 11 }}
                    axisLine={{ stroke: "#2a2840" }}
                    tickLine={false}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#8391ac", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                />
                <ReferenceLine y={FLAG_THRESHOLD} stroke="#ef517a" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="avgAi"
                    stroke="#5067e9"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#5067e9", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#ef517a", strokeWidth: 0 }}
                />
                <Line dataKey="count" hide />
            </LineChart>
        </ResponsiveContainer>
    );
}

function TeacherDashboard({ data }) {
    return (
        <div className={styles.dashWrapper}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSub}>Overview of your courses and student activity</p>
            </div>

            <div className={styles.statGrid}>
                <StatCard label="Courses" value={data.totalCourses} icon={BookOpen} accent="var(--sidebar-color)" />
                <StatCard label="Students" value={data.totalStudents} icon={Users} accent="var(--c-color2)" />
                <StatCard label="Submissions" value={data.totalSubmissions} icon={ClipboardList} accent="var(--secondary)" />
                <StatCard label="Flagged" value={data.flaggedCount} icon={AlertTriangle} accent="#ef517a" />
            </div>

            <div className={styles.trendCard}>
                <p className={styles.cardLabel}>AI Usage Trend — Weekly Average</p>
                <p className={styles.cardSub}>Dashed line marks the {FLAG_THRESHOLD}% flag threshold</p>
                <TrendChart data={data.weeklyTrend} />
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <p className={styles.cardLabel}>Average AI Percentage</p>
                    <AiGauge percentage={data.avgAiPercentage} />
                    {data.avgAiPercentage > FLAG_THRESHOLD && (
                        <div className={styles.warningBadge}>
                            <AlertTriangle size={13} strokeWidth={1.75} />
                            High AI usage detected across submissions
                        </div>
                    )}
                </div>

                <div className={styles.chartCard}>
                    <p className={styles.cardLabel}>Flagged vs Clean</p>
                    <FlagPieChart flagged={data.flaggedCount} total={data.totalSubmissions} />
                    <div className={styles.legend}>
                        <span className={styles.legendDot} style={{ background: "#ef517a" }} />
                        <span className={styles.legendText}>Flagged ({data.flaggedCount})</span>
                        <span className={styles.legendDot} style={{ background: "#4caf82", marginLeft: "0.75rem" }} />
                        <span className={styles.legendText}>Clean ({data.totalSubmissions - data.flaggedCount})</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <p className={styles.sectionLabel}>Recent Submissions</p>
                {data.recentSubmissions.length === 0 ? (
                    <p className={styles.empty}>No submissions yet.</p>
                ) : (
                    <div className={styles.submissionList}>
                        {data.recentSubmissions.map((s) => {
                            const aiPct = s.result?.ai_percentage;
                            const isMeaningfullyFlagged = s.result?.isFlagged && aiPct >= FLAG_THRESHOLD;
                            return (
                                <div key={s.id} className={styles.submissionRow}>
                                    <div className={styles.subInfo}>
                                        {s.user.profilePicture && (
                                            <img src={s.user.profilePicture} alt={s.user.name} width={30} height={30} className={styles.avatar} />
                                        )}
                                        <div>
                                            <p className={styles.subName}>{s.user.name}</p>
                                            <p className={styles.subAssignment}>{s.assignment.title}</p>
                                        </div>
                                    </div>
                                    <div className={styles.subMeta}>
                                        {aiPct != null ? (
                                            <span className={isMeaningfullyFlagged ? styles.flaggedBadge : styles.cleanBadge}>
                                                {isMeaningfullyFlagged ? "Flagged" : "Clean"} · {aiPct}%
                                            </span>
                                        ) : (
                                            <span className={styles.skippedBadge}>Too short</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function StudentDashboard({ data }) {
    const aiPct = data.avgAiPercentage;
    const isHigh = aiPct != null && aiPct > FLAG_THRESHOLD;

    return (
        <div className={styles.dashWrapper}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSub}>Your learning activity at a glance</p>
            </div>

            <div className={styles.statGrid}>
                <StatCard label="Enrolled Courses" value={data.enrolledCourses} icon={BookOpen} accent="var(--sidebar-color)" />
                <StatCard label="Submissions Made" value={data.submissionCount} icon={ClipboardList} accent="var(--secondary)" />
            </div>

            <div className={`${styles.chartCard} ${isHigh ? styles.chartCardWarning : ""}`}>
                <p className={styles.cardLabel}>Your Average AI Score</p>
                <AiGauge percentage={aiPct} />
                {isHigh && (
                    <div className={styles.warningBadge}>
                        <AlertTriangle size={13} strokeWidth={1.75} />
                        Your submissions are scoring high on AI detection. Try writing more in your own words.
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <p className={styles.sectionLabel}>
                    <CalendarClock size={14} strokeWidth={1.75} />
                    Due This Week
                </p>
                {data.upcomingAssignments.length === 0 ? (
                    <p className={styles.empty}>No assignments due in the next 7 days.</p>
                ) : (
                    <div className={styles.submissionList}>
                        {data.upcomingAssignments.map((a) => (
                            <NavLink key={a.id} to={`/courses/${a.course.id}/assignments/${a.id}`} className={styles.submissionRow}>
                                <div className={styles.subInfo}>
                                    <TrendingUp size={15} strokeWidth={1.75} className={styles.upcomingIcon} />
                                    <div>
                                        <p className={styles.subName}>{a.title}</p>
                                        <p className={styles.subAssignment}>{a.course.title}</p>
                                    </div>
                                </div>
                                <p className={styles.dueDate}>
                                    Due {new Date(a.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </p>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const { data, loading } = useDashboard();

    if (loading) return <div className="loading">Loading...</div>;
    if (!data) return <div className="loading">Failed to load dashboard.</div>;

    return user.role === "teacher"
        ? <TeacherDashboard data={data} />
        : <StudentDashboard data={data} />;
}
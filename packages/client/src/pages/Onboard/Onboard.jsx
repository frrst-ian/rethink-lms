import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { client } from "../../helpers/axiosClient";
import styles from "./onboard.module.css";

export default function Onboard() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { data } = await client.post("/auth/set-role", { role });
            login(data.token, data.user);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h2 className={styles.title}>Welcome to Rethink</h2>
                <p className={styles.subtitle}>How will you be using the platform?</p>

                <div className={styles.roles}>
                    {["student", "teacher"].map((r) => (
                        <button
                            key={r}
                            className={`${styles.roleBtn} ${role === r ? styles.active : ""}`}
                            onClick={() => setRole(r)}
                        >
                            <span className={styles.roleLabel}>
                                {r === "student" ? "🎓" : "📚"}
                            </span>
                            <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                        </button>
                    ))}
                </div>

                <button
                    className={styles.continueBtn}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Setting up..." : "Continue"}
                </button>
            </div>
        </div>
    );
}
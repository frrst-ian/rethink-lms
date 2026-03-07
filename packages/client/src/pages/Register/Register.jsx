import { useState, useEffect } from "react";
import useRegister from "../../hooks/register/useRegister";
import styles from "./register.module.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import GoogleIcon from "@mui/icons-material/Google";
import { CircleUserRound, AtSign, Lock, UserRound } from "lucide-react";

const Register = () => {
    const { registerUser, error, submitting } = useRegister();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");

    const handleSubmit = (e) => {
        e.preventDefault();

        registerUser(form);
    };

    const handleOAuthLogin = (provider) => {
        const baseUrl = import.meta.env.VITE_API_URL;
        window.location.href = `${baseUrl}/auth/${provider}`;
    };

    return (
        <>
            <div className={styles.registerContainer}>
                <div className={styles.registerFormContainer}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.formContent}>
                            <h2 className={styles.registerHeader}>
                                Create an account
                            </h2>

                            {error && (
                                <div className={styles.error}>
                                    {error.map((err, index) => (
                                        <span key={index}>{err}</span>
                                    ))}
                                </div>
                            )}
                            <Input
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                label="Full Name"
                                icon={UserRound}
                                required
                            />

                            <Input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                label="Email"
                                icon={AtSign}
                                required
                            />
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                label="Password"
                                icon={Lock}
                                required
                            />
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                label="Confirm Password"
                                icon={Lock}
                                required
                            />
                            <div className={styles.roleGroup}>
                                {["student", "teacher"].map((r) => (
                                    <label key={r}>
                                        <input
                                            type="radio"
                                            value={r}
                                            checked={role === r}
                                            onChange={() => setRole(r)}
                                        />
                                        {r.charAt(0).toUpperCase() +
                                            r.slice(1).toLowerCase()}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                    <div className={styles.oauthLogin}>
                        <p>or</p>
                        <button
                            className={styles.btnOAuth}
                            onClick={() => handleOAuthLogin("google")}
                        >
                            <GoogleIcon /> Continue with Google
                        </button>

                        <a
                            className={styles.btn}
                            rel="noopener noreferrer"
                            href="/login"
                        >
                            Already have an account? Login
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                fill="none"
                                viewBox="0 0 16 16"
                                className="icon page_arrowRight__4KrB_"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9.75 4.75 13.25 8m0 0-3.5 3.25M13.25 8H2.75"
                                ></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

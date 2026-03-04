import useLogin from "../../hooks/login/useLogin";
import Button from "../../components/Button;";
import Input from "../../components/Input";
import styles from "./login.module.css";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser, error, submitting } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(email, password);
    };

    const handleOAuthLogin = (provider) => {
        const baseUrl = import.meta.env.VITE_API_URL;
        window.location.href = `${baseUrl}/auth/${provider}`;
    };

    return (
        <>
            <div className={styles.loginContainer}>
                <div className={styles.loginFormContainer}>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <h2 className={styles.loginHeader}>Login to Rethink</h2>
                        {error && <span className={styles.error}>{error}</span>}

                        <Input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            label="Email"
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            label="Password"
                            required
                        />

                        <Button
                            type="primary"
                            label={submitting ? "Logging in..." : "Login"}
                            status={submitting}
                        ></Button>

                        <div className={styles.dividerWrapper}>
                            <hr className={styles.line} />
                            <p className={styles.dividerTxt}>or</p>
                        </div>
                    </form>
                    <div className={styles.oauthLogin}>
                        <button
                            className={styles.btnOAuth}
                            onClick={() => handleOAuthLogin("google")}
                        >
                            <GoogleIcon /> Continue with Google
                        </button>

                        <a
                            className={styles.btn}
                            rel="noopener noreferrer"
                            href="/register"
                        >
                            Don't have an account? Register
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
                <div className={styles.left}>
                    <img
                        src="undraw_vacation-selfie_q5bs.svg"
                        alt="selfie svg"
                        className={styles.selfieImg}
                    />
                    <p className={styles.tagline}>
                        Join odinbook to see what we're yapping about.
                    </p>
                </div>
            </div>
        </>
    );
}

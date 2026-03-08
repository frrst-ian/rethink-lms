import { useState } from "react";
import useRegister from "../../hooks/register/useRegister";
import styles from "./register.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { CircleUserRound, AtSign, Lock, UserRound } from "lucide-react";

const Register = () => {
    const { registerUser, errors, submitting } = useRegister();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await registerUser(name, email, password, confirmPassword, role);
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
                            {errors.length > 0 && (
                                <div className="error-container">
                                    {errors.map((error, index) => (
                                        <p key={index} className={styles.error}>
                                            {error}
                                        </p>
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
                                autoComplete="new-password"
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
                                autoComplete="new-password"
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
                            <Button
                                type="primary"
                                label={
                                    submitting
                                        ? "Creating Account..."
                                        : "Create Account"
                                }
                                status={submitting}
                            ></Button>
                        </div>
                    </form>
                    <div className={styles.oauthLogin}>
                        <p>or</p>
                        <button
                            className={styles.btnOAuth}
                            onClick={() => handleOAuthLogin("google")}
                            type="button"
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

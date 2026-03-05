import { useState, useEffect } from "react";
import useRegister from "../../hooks/register/useRegister";
import styles from "./register.module.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import GoogleIcon from "@mui/icons-material/Google";
import { CircleUserRound } from "lucide-react";

const Register = () => {
    const { registerUser, error, submitting } = useRegister();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [file, setSelectedFile] = useState(null);

    const [filePrev, setFilePrev] = useState(null);

    useEffect(() => {
        const filePreview = () => {
            if (!file) return;
            const reader = new FileReader();

            reader.onloadend = () => {
                setFilePrev(reader.result);
            };

            reader.readAsDataURL(file);
        };
        filePreview();
    }, [file]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();

        form.append("name", name);
        form.append("email", email);
        form.append("password", password);
        form.append("confirmPassword", confirmPassword);
        form.append("role", role);

        form.append("profilePicture", file);

        registerUser(form);
        setFilePrev(null);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleOAuthLogin = (provider) => {
        const baseUrl = import.meta.env.VITE_API_URL;
        window.location.href = `${baseUrl}/auth/${provider}`;
    };

    const removeFilePrev = () => {
        setFilePrev(null);
        setSelectedFile(null);
    };

    return (
        <>
            <div className={styles.registerContainer}>
                <div className={styles.registerFormContainer}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.left}>
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
                                required
                            />

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
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                label="Confirm Password"
                                required
                            />
                            <div className={styles.roleGroup}>
                                {["STUDENT", "TEACHER"].map((r) => (
                                    <label key={r}>
                                        <input
                                            type="radio"
                                            value={r}
                                            checked={role === r}
                                            onChange={() => setRole(r)}
                                        />
                                        {r.charAt(0) + r.slice(1).toLowerCase()}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.pfpWrapper}>
                                <label
                                    htmlFor="pfp"
                                    id={styles.customeFileUpload}
                                >
                                    <CircleUserRound
                                        strokeWidth={1}
                                        className={styles.pfpSvg}
                                    />
                                </label>
                                <input
                                    id="pfp"
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    accept="image/*"
                                    className={styles.fileUpload}
                                />
                                {filePrev && (
                                    <div>
                                        <img
                                            className={styles.imgPrev}
                                            src={filePrev}
                                            alt="Preview"
                                        />
                                        <button
                                            className={styles.closeBtn}
                                            onClick={() => removeFilePrev()}
                                        >
                                            x
                                        </button>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="primary"
                                label={
                                    submitting ? "Submitting..." : "Register"
                                }
                                status={submitting}
                            ></Button>
                        </div>
                    </form>
                    <div className={styles.oauthLogin}>
                        <div className={styles.dividerWrapper}>
                            <hr className={styles.line} />
                            <p className={styles.dividerTxt}>or</p>
                        </div>
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

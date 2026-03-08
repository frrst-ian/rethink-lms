import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { client } from "../../helpers/axiosClient";

export default function Onboard() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState("student");

    const handleSubmit = async () => {
        const { data } = await client.post("/auth/set-role", { role });
        login(data.token, data.user);
        navigate("/dashboard");
    };

    return (
        <div>
            <h2>I am a...</h2>
            {["student", "teacher"].map((r) => (
                <label key={r}>
                    <input
                        type="radio"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                    />
                    {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
                </label>
            ))}
            <button onClick={handleSubmit}>Continue</button>
        </div>
    );
}

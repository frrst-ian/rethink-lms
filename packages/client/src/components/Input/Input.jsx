import styles from "./button.module.css";

const Input = ({ type = "text", name, value, onChange, placeholder, required, autoComplete, label }) => {
    return (
        <div>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}          
                className={styles.nput}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
            />
        </div>
    );
};
export default Input;
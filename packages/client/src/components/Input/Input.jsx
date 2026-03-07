import styles from "./input.module.css";
const Input = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required,
    autoComplete,
    label,
    icon:Icon
}) => {
    return (
        <div className={styles.inputGroup}>
            {label && <label htmlFor={name}>{Icon && <Icon width="18" />}{label}</label>}
            <input
                id={name}
                className={styles.input}
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

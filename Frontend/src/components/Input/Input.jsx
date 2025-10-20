import React from "react";

function Input({ label, type = "text", value, onChange, placeholder, className = "", ...props}){
    return (
        <div className="input-group">
            {label && <label htmlFor={props.id || type}>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-field ${className}`}
                {...props}
            />
        </div>
    );
}

export default Input;
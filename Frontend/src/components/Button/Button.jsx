import React from 'react';
import { Link } from 'react-router-dom';

function Button({ children, onClick, to, type = "button", className = "", ...props }) {

    const baseClasses = `btn ${className}`;

    if (to) {
        return (
            <Link
                to={to}
                className={baseClasses}
                {...props}  
            >
                {children}
            </Link>
        );
    }
    return (
        <button
            type={type}
            onClick={onClick}
            className={baseClasses}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
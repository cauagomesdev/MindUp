// src/components/Textarea/Textarea.jsx
import React from 'react';

function Textarea({ label, value, onChange, placeholder, className = '', rows = 5, ...props }) {
  return (
    <div className="input-group"> 
      {label && <label htmlFor={props.id || 'textarea'}>{label}</label>}
      <textarea
        id={props.id || 'textarea'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${className}`} 
        rows={rows} 
        {...props}
      />
    </div>
  );
}

export default Textarea;
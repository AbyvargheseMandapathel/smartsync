import React, { useState } from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    error = '',
    icon = null,
    suffixIcon = null,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasValue = value && value.length > 0;
    const displayType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`input-wrapper ${className}`}>
            <div className={`input-container ${isFocused ? 'focused' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
                {icon && <span className="input-prefix-icon">{icon}</span>}

                <div className="input-field-wrapper">
                    <input
                        type={displayType}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={isFocused ? placeholder : ''}
                        required={required}
                        disabled={disabled}
                        className="input-field"
                        {...props}
                    />
                    <label
                        className={`input-label ${isFocused || hasValue ? 'floating' : ''}`}
                        htmlFor={name}
                    >
                        {label} {required && <span className="required-star">*</span>}
                    </label>
                </div>

                {type === 'password' && (
                    <button
                        type="button"
                        className="input-suffix-icon password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                )}

                {suffixIcon && type !== 'password' && (
                    <span className="input-suffix-icon">{suffixIcon}</span>
                )}
            </div>

            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;

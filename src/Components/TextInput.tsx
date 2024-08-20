import React from 'react';

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText = '',
  placeholder = '',
  className = '',
  size = 'medium',
  editable = true,
}) => {
  return (
    <div className={`text-input-container ${className}`}>
      {label && <label className="text-input-label">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-input ${error ? 'input-error' : ''} ${size}`}
        readOnly={!editable}
        onFocus={(e) => {
          if (editable) {
            e.target.classList.add('input-focused');
          }
        }}
        onBlur={(e) => e.target.classList.remove('input-focused')}
      />
      {helperText && <small className={`helper-text ${error ? 'error-text' : ''}`}>{helperText}</small>}
    </div>
  );
};

export default TextInput;

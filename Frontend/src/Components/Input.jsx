import React, {useId} from 'react'

const Input = ({ label, className, labelClassName, error, ...props }) => (
    <div className="space-y-2">
      {label && <label className={`block text-sm ${labelClassName}`}>{label}</label>}
      <input
        {...props}
        className={`w-full transition-colors duration-200 ${className}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
  

export default Input
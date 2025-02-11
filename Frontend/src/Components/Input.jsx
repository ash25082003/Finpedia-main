import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    variant = "light",
    error,
    ...props
}, ref) {
    const id = useId()
    
    const inputClasses = {
        light: 'bg-white text-gray-900 border-gray-200 focus:bg-gray-50 focus:ring-2 focus:ring-green-400',
        dark: 'bg-gray-700/30 text-gray-100 border-gray-600 focus:bg-gray-800/50 focus:ring-2 focus:ring-green-400 placeholder-gray-400'
    }

    const labelClasses = {
        light: 'text-gray-700',
        dark: 'text-gray-400'
    }

    return (
        <div className='w-full space-y-1'>
            {label && (
                <label 
                    className={`inline-block pl-1 text-sm font-medium ${labelClasses[variant]}`} 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            
            <input
                type={type}
                className={`px-4 py-3 rounded-lg border outline-none w-full transition-all duration-200 
                    ${inputClasses[variant]} 
                    ${error ? 'border-red-400/50 focus:ring-red-400/30' : ''}
                    ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
            
            {error && (
                <p className={`text-sm pl-1 ${variant === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                </p>
            )}
        </div>
    )
})

export default Input

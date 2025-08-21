import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'edit' | 'delete' | 'toggle';
  loading?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'edit',
  loading = false,
  disabled,
  className = '',
  children,
  size = 'md',
  ...props
}) => {
  const baseClasses = 'cursor-pointer p-2 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    edit: 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    delete: 'text-gray-400 hover:text-red-600 hover:bg-red-50 focus:ring-red-500',
    toggle: 'cursor-pointer transition-colors duration-200'
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${loading || disabled ? 'cursor-not-allowed opacity-50' : ''}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;

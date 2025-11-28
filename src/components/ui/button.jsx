import React from "react";
import { motion } from "framer-motion";

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  children, 
  disabled, 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = asChild ? motion.div : motion.button;
  
  // Base styles
  let baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  // Variant styles
  const variants = {
    default: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };
  
  // Size styles
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };
  
  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;
  
  const buttonClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;
  
  return (
    <Comp
      className={buttonClassName}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button }; 
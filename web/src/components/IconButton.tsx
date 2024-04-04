import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps extends ComponentProps<'button'> {
    transparent?: boolean
}

export function IconButton({transparent, ...rest}: IconButtonProps) {
    return (
    <button 
        {...rest} 
        className={twMerge(
            'border border-white/10 rounded-md p-1.5',
            transparent ? 'bg-black/20' : 'bg-white/20',
            rest.disabled ? 'opacity-50' : null 
        )}
    />
    )
} 
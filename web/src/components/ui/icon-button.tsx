import type { ComponentProps, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

const iconButton = tv({
	base: 'flex items-center justify-center rounded-lg hover:bg-zinc-700 transition-colors duration-150',
	variants: {
		size: {
			sm: 'size-6',
			md: 'size-8',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

interface IconButtonProps extends ComponentProps<'button'> {
	icon: ReactNode;
	size?: 'sm' | 'md';
}

export const IconButton = ({
	icon,
	size,
	className,
	...props
}: IconButtonProps) => {
	return (
		<button
			type="button"
			className={iconButton({ size, className })}
			{...props}
		>
			{icon}
		</button>
	);
};

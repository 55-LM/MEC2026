import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  if ('href' in rest && rest.href) {
    const { href, target, rel, onClick, disabled } = rest;
    if (disabled) {
      return (
        <span className={`${classes} is-disabled`} aria-disabled="true">
          {children}
        </span>
      );
    }
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

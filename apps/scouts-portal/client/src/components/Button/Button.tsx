'use client';

import { VariantProps } from 'class-variance-authority';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { buttonChildStyles, buttonStyles } from './Button.styles';
import { IButton } from './Button.types';

export const Button = (
  props: IButton & VariantProps<typeof buttonStyles> & VariantProps<typeof buttonChildStyles>,
) => {
  const {
    children,
    buttonType,
    variant,
    size,
    roundedness,
    fullWidth,
    disabled,
    isLoading,
    className = '',
    childClassName = '',
    dataTestid,
    ...nativeButtonProps
  } = props;

  const buttonState = isLoading
    ? { isLoading: variant }
    : disabled
    ? { disable: variant }
    : { variant };

  return (
    <button
      className={`${buttonStyles({
        ...(disabled ? { disable: variant } : { variant }),
        buttonType,
        size,
        roundedness,
        fullWidth,
      })} ${className}`}
      disabled={disabled || isLoading}
      {...nativeButtonProps}
      data-testid={dataTestid}
    >
      <span
        className={`${buttonChildStyles({
          size,
          ...(disabled && { disable: variant }),
        })} ${childClassName}`}
      >
        {isLoading ? <LoadingSpinner spinnerSize="sm" /> : null}
        {children}
      </span>
    </button>
  );
};

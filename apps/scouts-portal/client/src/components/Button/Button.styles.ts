import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'flex text-sm font-medium tracking-wide items-center justify-center capitalize px-1 tablet:px-3.5 laptop:px-6 gap-2 cursor-pointer',
  {
    variants: {
      buttonType: {
        base: 'border',
        outlined: 'border-2 border-light',
      },
      variant: {
        primary:
          'border-green-600 bg-green-600 text-white hover:bg-green-700 active:bg-green-700 hover:border-green-700 disabled:cursor-not-allowed',
        secondary:
          'border-gray-200 bg-white text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed',
        tertiary:
          'text-green-600 hover:text-green-700 bg-transparent border-0 px-1 disabled:cursor-not-allowed',
        danger:
          'bg-red-500 text-white hover:bg-red-700 hover:border-red-700 disabled:cursor-not-allowed',
      },
      disable: {
        primary:
          'bg-gray-200 text-gray-500 show-custom-cursor disabled:cursor-not-allowed select-none',
        secondary:
          'bg-gray-200 text-gray-500 show-custom-cursor disabled:cursor-not-allowed select-none ',
        tertiary:
          'text-gray-200 bg-transparent border-0 px-1 color-gray-500 disabled:cursor-not-allowed',
        danger:
          'bg-gray-50 text-gray-500 show-custom-cursor disabled:cursor-not-allowed	select-none ',
      },
      size: {
        sm: 'h-7 py-1.5',
        md: 'h-9 py-2',
        lg: 'h-12 py-3',
        xl: 'h-14 py-4',
      },
      roundedness: {
        full: 'rounded-full',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        none: 'rounded-none',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      buttonType: 'base',
      size: 'lg',
      roundedness: 'md',
      fullWidth: false,
    },
  },
);

export const buttonChildStyles = cva('flex justify-center items-center w-full px-1 tablet:px-0 gap-x-1 tablet:gap-x-2', {
  variants: {
    size: {
      sm: 'text-xs tablet:text-sm leading-2',
      md: 'text-xs tablet:text-sm',
      lg: 'text-sm',
    },
    disable: {
      primary: 'text-neutral-400',
      secondary: 'text-neutral-400',
      'primary-light': 'text-white/20',
      danger: 'text-neutral-400',
      dark: 'text-white/20',
      dark2: 'text-white/20',
      tertiary: 'text-neutral-400',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

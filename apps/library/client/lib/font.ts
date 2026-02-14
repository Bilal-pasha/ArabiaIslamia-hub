import localFont from 'next/font/local';

export const appRtlFont = localFont({
    src: [
        {
            path: '../public/fonts/Gulzar-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--gulzar-font',
    display: 'swap',
});

export const FontFamilies = ['Gulzar'];
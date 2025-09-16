/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#FF6114',
                disable: '#B8BFCC',
                darkGray: '#98A2B2',
                bright1: '#E9EBF0',
                bright2: 'E1EAFD',
                gray1: '#EBEEF2',
            },
        },
    },
    plugins: [],
};

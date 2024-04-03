/** @type {import('tailwindcss').Config} */
module.exports = {
    // important: '#proply-backend',
    content: [
        "./**/*.php",
        "./src/**/*.tsx"
    ],
    theme: {
        extend: {
            colors: {
                polaris: {
                    blue: '#004E97',
                    gray: '#DAD9D7',
                    lightGray: '#E4E4E4',
                    lighterGray: '#EDEDED',
                    lightestGray: '#FAFAFA',
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}


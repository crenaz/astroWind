const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: colors.cyan,
				secondary: colors.pink,
			},
			fontFamily: {
				sans: ["'InterVariable'", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
};

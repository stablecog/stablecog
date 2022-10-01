function withOpacityValue(variable) {
	return ({ opacityValue }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`;
		}
		return `rgb(var(${variable}) / ${opacityValue})`;
	};
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'c-bg': withOpacityValue('--c-bg'),
				'c-bg-secondary': withOpacityValue('--c-bg-secondary'),
				'c-bg-tertiary': withOpacityValue('--c-bg-tertiary'),
				'c-on-bg': withOpacityValue('--c-on-bg'),
				'c-primary': withOpacityValue('--c-primary'),
				'c-on-primary': withOpacityValue('--c-on-primary'),
				'c-secondary': withOpacityValue('--c-secondary'),
				'c-danger': withOpacityValue('--c-danger'),
				'c-success': withOpacityValue('--c-success'),
				'c-shadow': withOpacityValue('--c-shadow'),
				'c-barrier': withOpacityValue('--c-barrier')
			},
			transitionDuration: {
				DEFAULT: '200ms'
			},
			spacing: {
				'2px': '2px',
				88: '22rem',
				128: '32rem'
			},
			opacity: {
				3: '0.03',
				4: '0.04',
				8: '0.08',
				15: '0.15'
			},
			rotate: {
				360: '360deg',
				270: '270deg'
			}
		}
	},
	plugins: []
};

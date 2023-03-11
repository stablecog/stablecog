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
				'c-on-bg-secondary': withOpacityValue('--c-on-bg-secondary'),
				'c-primary': withOpacityValue('--c-primary'),
				'c-primary-secondary': withOpacityValue('--c-primary-secondary'),
				'c-on-primary': withOpacityValue('--c-on-primary'),
				'c-secondary': withOpacityValue('--c-secondary'),
				'c-danger': withOpacityValue('--c-danger'),
				'c-danger-secondary': withOpacityValue('--c-danger-secondary'),
				'c-success': withOpacityValue('--c-success'),
				'c-success-secondary': withOpacityValue('--c-success-secondary'),
				'c-shadow': withOpacityValue('--c-shadow'),
				'c-barrier': withOpacityValue('--c-barrier')
			},
			transitionDuration: {
				DEFAULT: '200ms',
				250: '250ms',
				350: '350ms',
				400: '400ms'
			},
			transitionTimingFunction: {
				'image-generation': 'cubic-bezier(.4,0,.3,1)'
			},
			spacing: {
				'1ch': '1ch',
				'2px': '2px',
				'3px': '3px',
				'4px': '4px',
				0.25: '0.0625rem',
				0.75: '0.1875rem',
				1.25: '0.3125rem',
				3.25: '0.8125rem',
				4.5: '1.125rem',
				5.5: '1.375rem',
				6.5: '1.625rem',
				13: '3.25rem',
				15: '3.75rem',
				22: '5.5rem',
				17: '4.25rem',
				18: '4.5rem',
				30: '7.5rem',
				46: '11.5rem',
				58: '14.5rem',
				60: '15rem',
				62: '15.5rem',
				68: '17rem',
				76: '19rem',
				84: '21rem',
				86: '21.5rem',
				88: '22rem',
				90: '22.5rem',
				92: '23rem',
				93: '23.25rem',
				96: '24rem',
				100: '25rem',
				104: '26rem',
				108: '27rem',
				112: '28rem',
				128: '32rem',
				132: '33rem',
				140: '35rem',
				160: '40rem',
				168: '42rem',
				172: '43rem',
				180: '45rem',
				'4vh': '4vh',
				'5vh': '5vh'
			},
			opacity: {
				2: '0.02',
				3: '0.03',
				4: '0.04',
				6: '0.06',
				8: '0.08',
				15: '0.15',
				35: '0.35',
				85: '0.85'
			},
			borderWidth: {
				1.5: '1.5px',
				'3px': '3px',
				'4px': '4px'
			},
			rotate: {
				90: '90deg',
				15: '15deg',
				360: '360deg',
				135: '135deg',
				270: '270deg'
			},
			fontSize: {
				'3.5xl': [
					'2rem',
					{
						lineHeight: '2.25rem'
					}
				],
				xxs: [
					'0.6rem',
					{
						lineHeight: '0.75rem'
					}
				],
				'4.5xl': [
					'2.5rem',
					{
						lineHeight: '2.5rem'
					}
				]
			},
			lineHeight: {
				4.5: '1.125rem'
			},
			width: {
				'1/7': '14.2857143%',
				'1/8': '12.5%'
			},
			scale: {
				25: '0.25',
				60: '0.6',
				65: '0.65',
				70: '0.7',
				101: '1.01',
				102: '1.02',
				103: '1.03',
				135: '1.35',
				160: '1.6',
				175: '1.75',
				200: '2'
			},
			boxShadow: {
				navbar: '0 0 1.5rem 0',
				'settings-page': '0 0 1rem 0',
				'generation-sidebar': '0 0 1rem 0',
				'generation-modal': '0 1rem 2rem 0',
				sheet: '0 0 2rem 0'
			},
			screens: {
				'1.5xl': '1408px',
				'2.5xl': '1728px',
				'3xl': '1920px',
				'4xl': '2560px'
			},
			ringWidth: {
				3: '3px'
			},
			maxWidth: {
				'2.5xl': '45rem',
				'6.5xl': '76rem'
			},
			animation: {
				'ping-custom': 'ping-custom 1s ease-out infinite -0.9s',
				'ping-custom-bg': 'ping-custom-bg 1s ease infinite',
				'pulse-custom': 'pulse-custom 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
				'pulse-scale': 'pulse-scale 0.75s cubic-bezier(0.5, 0, 0.5, 1) infinite',
				'spin-faster': 'spin-faster 0.75s linear infinite',
				'pulse-faster': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
			},
			ringWidth: {
				1.5: '1.5px'
			},
			zIndex: {
				100: '100'
			},
			borderRadius: {
				lg2: '0.625rem',
				'4xl': '2rem',
				'5xl': '2.5rem'
			},
			keyframes: {
				'pulse-custom': {
					'0%, 100%': {
						opacity: '0.3'
					},
					'50%': {
						opacity: '0.2'
					}
				},
				'pulse-scale': {
					'0%, 100%': {
						opacity: '0.75',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.25',
						transform: 'scale(1.75)'
					}
				},
				'ping-custom': {
					'0%': {
						opacity: '1',
						transform: 'scale(0)'
					},
					'60%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(1)'
					}
				},
				'ping-custom-bg': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.2)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'spin-faster': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			}
		}
	},
	plugins: [require('tailwindcss-labeled-groups')(['1', '2', '3'])]
};

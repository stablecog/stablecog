import plugin from 'tailwindcss/plugin';
import containerQueries from '@tailwindcss/container-queries';

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
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('not-touch', '.not-touch &'); // here
		}),
		containerQueries
	],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'c-bg': withOpacityValue('--c-bg'),
				'c-bg-secondary': withOpacityValue('--c-bg-secondary'),
				'c-bg-tertiary': withOpacityValue('--c-bg-tertiary'),
				'c-on-bg': withOpacityValue('--c-on-bg'),
				'c-on-bg-faded': withOpacityValue('--c-on-bg-faded'),
				'c-on-bg-secondary': withOpacityValue('--c-on-bg-secondary'),
				'c-primary': withOpacityValue('--c-primary'),
				'c-primary-secondary': withOpacityValue('--c-primary-secondary'),
				'c-tertiary': withOpacityValue('--c-tertiary'),
				'c-on-primary': withOpacityValue('--c-on-primary'),
				'c-secondary': withOpacityValue('--c-secondary'),
				'c-danger': withOpacityValue('--c-danger'),
				'c-danger-secondary': withOpacityValue('--c-danger-secondary'),
				'c-success': withOpacityValue('--c-success'),
				'c-success-secondary': withOpacityValue('--c-success-secondary'),
				'c-shadow': withOpacityValue('--c-shadow'),
				'c-barrier': withOpacityValue('--c-barrier'),
				'c-twitter': withOpacityValue('--c-twitter'),
				'c-instagram': withOpacityValue('--c-instagram'),
				'c-facebook': withOpacityValue('--c-facebook')
			},
			transitionDuration: {
				DEFAULT: '200ms',
				250: '250ms',
				350: '350ms',
				400: '400ms'
			},
			ringWidth: {
				3: '3px',
				5: '5px',
				6: '6px'
			},
			transitionTimingFunction: {
				'image-generation': 'cubic-bezier(.4,0,.3,1)',
				'bounce-out': 'cubic-bezier(.3,2,.5,.8)'
			},
			spacing: {
				'1ch': '1ch',
				'2px': '2px',
				'3px': '3px',
				'4px': '4px',
				'5px': '5px',
				'6px': '6px',
				'7px': '7px',
				'8px': '8px',
				0.25: '0.0625rem',
				0.75: '0.1875rem',
				1.25: '0.3125rem',
				1.75: '0.4375rem',
				2.25: '0.5625rem',
				3.25: '0.8125rem',
				3.75: '0.9375rem',
				4.5: '1.125rem',
				5.5: '1.375rem',
				7.5: '1.875rem',
				10.5: '2.625rem',
				6.5: '1.625rem',
				13: '3.25rem',
				15: '3.75rem',
				22: '5.5rem',
				26: '6.5rem',
				17: '4.25rem',
				18: '4.5rem',
				27: '6.75rem',
				30: '7.5rem',
				42: '10.5rem',
				46: '11.5rem',
				58: '14.5rem',
				60: '15rem',
				62: '15.5rem',
				68: '17rem',
				76: '19rem',
				84: '21rem',
				86: '21.5rem',
				87: '21.75rem',
				88: '22rem',
				89: '22.25rem',
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
				174: '43.5rem',
				176: '44rem',
				178: '44.5rem',
				180: '45rem',
				182: '45.5rem',
				184: '46rem',
				'4vh': '4vh',
				'5vh': '5vh'
			},
			translate: {
				'1/5': '20%'
			},
			opacity: {
				2: '0.02',
				3: '0.03',
				4: '0.04',
				6: '0.06',
				8: '0.08',
				12: '0.12',
				15: '0.15',
				35: '0.35',
				85: '0.85'
			},
			borderWidth: {
				1.5: '1.5px',
				'3px': '3px',
				3: '3px',
				'4px': '4px'
			},
			rotate: {
				30: '30deg',
				90: '90deg',
				15: '15deg',
				360: '360deg',
				135: '135deg',
				270: '270deg'
			},
			fontSize: {
				'1.5xl': [
					'1.375rem',
					{
						lineHeight: '1.875rem'
					}
				],
				'3.5xl': [
					'2rem',
					{
						lineHeight: '2.25rem'
					}
				],
				xxs: [
					'0.65rem',
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
				5: '0.05',
				7: '0.07',
				10: '0.1',
				15: '0.15',
				25: '0.25',
				40: '0.4',
				60: '0.6',
				65: '0.65',
				70: '0.7',
				80: '0.8',
				85: '0.85',
				93: '0.93',
				97: '0.97',
				98: '0.98',
				98.5: '0.985',
				99: '0.99',
				100.1: '1.001',
				100.2: '1.002',
				100.25: '1.0025',
				100.5: '1.005',
				101: '1.01',
				102: '1.02',
				103: '1.03',
				115: '1.15',
				120: '1.2',
				135: '1.35',
				160: '1.6',
				175: '1.75',
				200: '2'
			},
			boxShadow: {
				navbar:
					'0px 2px 0px 0px rgb(var(--c-bg-secondary)), 0rem 1.5rem 1.5rem -1.5rem rgba(var(--c-shadow)/var(--o-shadow-strongest))',
				'navbar-0':
					'0px 0px 0px 0px rgb(var(--c-bg-secondary)), 0rem 0rem 0rem 0rem rgba(var(--c-shadow)/var(--o-shadow-strongest))',
				drawer: '0 0 2rem 0',
				'settings-page': '0 0 1rem 0',
				'generation-sidebar': '0 0 1rem 0',
				'generation-modal': '0 1rem 2rem 0',
				'sheet-closed': '0 0 1rem 0',
				'sheet-open': '0 0 4rem 0'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			},
			screens: {
				'1.5xl': '1408px',
				'2.5xl': '1728px',
				'3xl': '1920px',
				'4xl': '2560px'
			},
			maxWidth: {
				'2.5xl': '45rem',
				'6.5xl': '76rem'
			},
			animation: {
				'ping-custom': 'ping-custom 1s ease-out infinite -0.9s',
				'ping-custom-bg': 'ping-custom-bg 1s ease infinite',
				'ping-speaker': 'ping-speaker 1.5s cubic-bezier(.2,0,.15,1) infinite',
				'ping-speaker-bg': 'ping-speaker-bg 1.5s cubic-bezier(.5,0,.5,1) infinite',
				'pulse-custom': 'pulse-custom 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
				'pulse-scale': 'pulse-scale 0.75s cubic-bezier(0.5, 0, 0.5, 1) infinite',
				'spin-faster': 'spin-faster 0.75s linear infinite',
				'pulse-faster': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
				'slide-up-and-fade': 'slide-up-and-fade 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				hourglass: 'hourglass 3s cubic-bezier(0.4, 0, 0.2, 1) infinite'
			},
			ringWidth: {
				1.5: '1.5px',
				3: '3px'
			},
			zIndex: {
				60: '60',
				100: '100',
				101: '101'
			},
			borderRadius: {
				'1.5xl': '0.875rem',
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
				'ping-speaker': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.08)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'ping-speaker-bg': {
					'0%': {
						opacity: '1',
						transform: 'scale(0)'
					},
					'50%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(2)'
					}
				},
				'spin-faster': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'slide-up-and-fade': {
					'0%': {
						opacity: '0',
						transform: 'translateY(0.5rem)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				hourglass: {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'20%': {
						transform: 'rotate(180deg)'
					},
					'50%': {
						transform: 'rotate(180deg)'
					},
					'70%': {
						transform: 'rotate(360deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			}
		}
	}
};

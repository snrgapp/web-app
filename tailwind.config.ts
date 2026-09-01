import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-dark': 'var(--color-primary-dark)',
  			background: 'hsl(var(--background))',
  			'background-alt': 'var(--color-background-alt)',
  			text: 'var(--color-text)',
  			'text-secondary': 'var(--color-text-secondary)',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			'accent-light': 'var(--color-accent-light)',
  			yellow: 'var(--color-yellow)',
  			'yellow-dark': 'var(--color-yellow-dark)',
  			red: 'var(--color-red)',
  			'red-dark': 'var(--color-red-dark)',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			'pure-dark': '#050505',
  			'neon-lime': '#BFFF00',
			members: {
				background: '#000000',
				surface: '#121212',
				'surface-container': '#1f1f28',
				'surface-container-low': '#1b1b24',
				'surface-container-high': '#2a2933',
				'surface-bright': '#393842',
				'surface-variant': '#35343e',
				'on-surface': '#e4e1ee',
				'on-surface-variant': '#c7c4d8',
				primary: '#c3c0ff',
				'primary-container': '#4f46e5',
				secondary: '#4edea3',
				'secondary-container': '#00a572',
				success: '#10B981',
				tertiary: '#ffb695',
				outline: '#918fa1',
				'outline-variant': '#464555',
				border: '#262626',
				hover: '#1A1A1A',
				'hover-border': '#333333',
				input: '#080808',
				'admin-surface': '#13121b',
				'admin-surface-container': '#1b1b24',
				'surface-container-lowest': '#0e0d16',
				'surface-container-highest': '#35343e',
				'on-primary-container': '#dad7ff',
				pending: '#f59e0b',
			}
  		},
  		fontWeight: {
  			hero: '900'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'reviews-scroll-left': {
  				'0%': { transform: 'translateX(0)' },
  				'100%': { transform: 'translateX(-50%)' },
  			},
  			'reviews-scroll-right': {
  				'0%': { transform: 'translateX(-50%)' },
  				'100%': { transform: 'translateX(0)' },
  			},
  			'members-pulse': {
  				'0%, 100%': { opacity: '1', transform: 'scale(1)' },
  				'50%': { opacity: '.5', transform: 'scale(1.1)' },
  			},
  		},
  		animation: {
  			'reviews-scroll-left': 'reviews-scroll-left 38s linear infinite',
  			'reviews-scroll-right': 'reviews-scroll-right 44s linear infinite',
  			'members-pulse': 'members-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

# Next Transition Bar

A lightweight, customizable progress bar for Next.js page transitions. Works with both **App Router** and **Pages Router**, and properly handles **middleware redirects**, **programmatic navigation**, and **browser back/forward**.

[Live Demo](https://next-transition-bar.vercel.app)

## Installation

```bash
npm install next-transition-bar
```

Or with yarn:

```bash
yarn add next-transition-bar
```

## Usage

### App Router (`app/layout.tsx`)

```tsx
import NextTransitionBar from 'next-transition-bar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTransitionBar />
        {children}
      </body>
    </html>
  );
}
```

### Pages Router (`pages/_app.tsx`)

```tsx
import NextTransitionBar from 'next-transition-bar';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextTransitionBar />
      <Component {...pageProps} />
    </>
  );
}
```

### Importing the nprogress instance

```ts
import { nprogress } from 'next-transition-bar';

// Manually control the progress bar
nprogress.start();
nprogress.done();
nprogress.set(0.5);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#29d"` | Color of the progress bar |
| `height` | `number` | `3` | Height in pixels |
| `initialPosition` | `number` | `0.08` | Initial position (0.08 = 8%) |
| `trickleSpeed` | `number` | `200` | Increment delay in ms |
| `speed` | `number` | `200` | Animation speed in ms |
| `easing` | `string` | `"ease"` | CSS easing string |
| `trickle` | `boolean` | `true` | Auto-increment behavior |
| `showSpinner` | `boolean` | `true` | Show the spinner |
| `shadow` | `string \| false` | `"0 0 10px ${color}, 0 0 5px ${color}"` | Shadow (set `false` to disable) |
| `template` | `string` | _(default template)_ | Custom HTML template |
| `zIndex` | `number` | `1600` | z-index of the progress bar |
| `showAtBottom` | `boolean` | `false` | Show at bottom instead of top |
| `isRTL` | `boolean` | `false` | Right-to-left direction |
| `nonce` | `string` | `undefined` | Nonce for the style tag (CSP) |
| `transformCSS` | `(css: string) => JSX.Element` | _(default)_ | Custom CSS rendering |
| `startDelay` | `number` | `0` | Delay in ms before showing the bar (avoids flash on fast navigations) |

## Examples

### Custom styling

```tsx
<NextTransitionBar
  color="#ff5722"
  height={4}
  showSpinner={false}
  shadow="0 0 10px #ff5722, 0 0 5px #ff5722"
/>
```

### Avoid flashing on fast navigations

```tsx
<NextTransitionBar startDelay={100} />
```

### Skip progress bar for specific links

Add `data-nprogress="ignore"` to any anchor:

```html
<a href="/no-progress" data-nprogress="ignore">This link won't trigger the bar</a>
```

## How it works

- Listens for anchor clicks via **event delegation** (single listener on `document`)
- Intercepts `history.pushState` and `history.replaceState` to detect navigation completion
- Handles `popstate` events for browser back/forward navigation
- Properly completes the progress bar on **middleware redirects** (which use `replaceState`)

## License

MIT

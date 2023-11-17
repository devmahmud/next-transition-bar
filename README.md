# Next Transition Bar

Elevate the user experience in your Next.js applications effortlessly with **next-transition-bar** – a versatile npm package designed to seamlessly enhance page transition progress. This lightweight and customizable solution adds a top loader and progress bar, delivering both visual appeal and a smooth transition experience.

## Installation

You can install the package using npm:

```bash
npm install next-transition-bar
```

Or if you prefer using yarn:

```bash
yarn add next-transition-bar
```

## Usage

Start by importing the package:

```js
import NextTransitionBar from 'next-transition-bar';
```

### Integration with `app/layout.js` (for `app` folder structure)

Include `<NextTransitionBar />` within the `return()` statement inside the `<body></body>` of your `RootLayout()`:

```js
import NextTransitionBar from 'next-transition-bar';

export default function RootLayout({ children }) {
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

### Integration with `pages/_app.js` (for `pages` folder structure)

To render, add `<NextTransitionBar />` within the `return()` statement in `MyApp()`:

```js
import NextTransitionBar from 'next-transition-bar';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextTransitionBar />
      <Component {...pageProps} />;
    </>
  );
}
```

### Importing nprogress instance

To import `nprogress` from 'next-transition-bar':

```js
import { nprogress } from 'next-transition-bar';
```

or both

```js
import NextTransitionBar, { nprogress } from 'next-transition-bar';
```

### Default Configuration

If no props are passed to `<NextTransitionBar />`, the package applies the following default configuration:

```jsx
<NextTransitionBar
  color="#29d"
  initialPosition={0.08}
  trickleSpeed={200}
  height={3}
  trickle={true}
  showSpinner={true}
  easing="ease"
  speed={200}
  shadow="0 0 10px #29d, 0 0 5px #29d"
  template='<div class="bar" role="bar"><div class="peg"></div></div>
            <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  zIndex={1600}
  showAtBottom={false}
  isRTL={false}
  nonce={undefined}
  transformCSS={(css) => <style nonce={undefined}>{css}</style>}
/>
```

- `color`: Change the default color of the top loader.
- `initialPosition`: Adjust the initial position of the top loader (in percentage, e.g., `0.08 = 8%`).
- `trickleSpeed`: Incremental delay speed in milliseconds.
- `speed`: Animation speed for the top loader in milliseconds.
- `easing`: Animation settings using easing (a CSS easing string).
- `height`: Height of the top loader in pixels.
- `trickle`: Auto-incrementing behavior for the top loader.
- `showSpinner`: Toggle spinner visibility.
- `shadow`: A smooth shadow for the top loader (set to `false` to disable it).
- `template`: Include custom HTML attributes for the top loader.
- `zIndex`: Define zIndex for the top loader.
- `showAtBottom`: Display the top loader at the bottom (increase height to ensure visibility on mobile devices).
- `isRTL`: Change the direction of the loader.
- `nonce`: The nonce attribute to use for the `style` tag.
- `transformCSS`: This is useful if you want to use a different style or minify the CSS.

Experience a sleek and visually appealing progress bar with **next-transition-bar**. Customize it to suit your application's unique style and provide users with a delightful journey through your Next.js app.

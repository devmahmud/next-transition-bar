'use client';

import * as React from 'react';
import nprogress from './nprogress';

export type NextTransitionBarProps = {
  /**
   * Color for the progressbar.
   * @default "#29d"
   */
  color?: string;
  /**
   * The initial position for the progressbar in percentage, 0.08 is 8%.
   * @default 0.08
   */
  initialPosition?: number;
  /**
   * Increment delay speed in milliseconds.
   * @default 200
   */
  trickleSpeed?: number;
  /**
   * The height for the progressbar in pixels (px).
   * @default 3
   */
  height?: number;
  /**
   * Auto incrementing behaviour for the progressbar.
   * @default true
   */
  trickle?: boolean;
  /**
   * To show spinner or not.
   * @default true
   */
  showSpinner?: boolean;
  /**
   * Animation settings using easing (a CSS easing string).
   * @default "ease"
   */
  easing?: string;
  /**
   * Animation speed in ms for the progressbar.
   * @default 200
   */
  speed?: number;
  /**
   * Defines a shadow for the progressbar.
   * @default "0 0 10px ${color},0 0 5px ${color}"
   *
   * @ you can disable it by setting it to `false`
   */
  shadow?: string | false;
  /**
   * Defines a template for the progressbar.
   * @default "<div class="bar" role="bar"><div class="peg"></div></div>
   * <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>"
   */
  template?: string;
  /**
   * Defines zIndex for the progressbar.
   * @default 1600
   */
  zIndex?: number;
  /**
   * To show the TopLoader at bottom.
   * @default false
   */
  showAtBottom?: boolean;
  /**
   * To change the direction of the progressbar.
   * @default false
   */
  isRTL?: boolean;
  /**
   * The nonce attribute to use for the `style` tag.
   * @default undefined
   */
  nonce?: string;
  /**
   * Use your custom CSS tag instead of the default one.
   * This is useful if you want to use a different style or minify the CSS.
   * @default (css) => <style nonce={nonce}>{css}</style>
   */
  transformCSS?: (css: string) => JSX.Element;
  /**
   * Delay in ms before the progress bar appears after a navigation starts.
   * Useful to avoid flashing the bar on fast navigations.
   * @default 0
   */
  startDelay?: number;
};

type HistoryMethod = typeof window.history.pushState;

const NextTransitionBar = ({
  color: propColor,
  height: propHeight,
  showSpinner,
  trickle,
  trickleSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  template,
  zIndex = 1600,
  showAtBottom = false,
  isRTL,
  nonce,
  transformCSS = (css) => (
    <style nonce={nonce} jsx="true" global="true" precedence="default" href="next-transition-bar">
      {css}
    </style>
  ),
  startDelay = 0,
}: NextTransitionBarProps) => {
  const defaultColor = '#29d';
  const defaultHeight = 3;

  const color = propColor ?? defaultColor;
  const height = propHeight ?? defaultHeight;

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    !shadow && shadow !== undefined
      ? ''
      : shadow
        ? `box-shadow:${shadow}`
        : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  const positionStyle = showAtBottom ? 'bottom: 0;' : 'top: 0;';
  const spinnerPositionStyle = showAtBottom ? 'bottom: 15px;' : 'top: 15px;';
  const spinnerRotationDirection = isRTL ? '-360deg' : '360deg';
  const shadowTransform = showAtBottom ? 'rotate(-3deg) translate(0px, 4px)' : 'rotate(3deg) translate(0px, -4px)';

  React.useEffect(() => {
    nprogress.configure({
      showSpinner: showSpinner ?? true,
      trickle: trickle ?? true,
      trickleSpeed: trickleSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? 'ease',
      speed: speed ?? 200,
      isRTL,
      template,
    });

    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const startProgress = () => {
      if (startDelay > 0) {
        startTimer = setTimeout(() => {
          nprogress.start();
        }, startDelay);
      } else {
        nprogress.start();
      }
    };

    const stopProgress = () => {
      if (startTimer) {
        clearTimeout(startTimer);
        startTimer = null;
      }
      nprogress.done();
    };

    /**
     * Determines if an anchor click should trigger the progress bar.
     */
    const shouldTrackNavigation = (anchor: HTMLAnchorElement, event: MouseEvent): boolean => {
      const targetUrl = anchor.href;
      const onlyHref = targetUrl.replace(location.origin, '');

      // Skip if the default action was already prevented by another handler
      if (event.defaultPrevented) return false;

      // Skip anchors with target="_blank"
      if (anchor.target === '_blank') return false;

      // Skip anchors with download attribute
      if (anchor.hasAttribute('download')) return false;

      // Skip external urls
      if (targetUrl && targetUrl.indexOf(location.origin) !== 0) return false;

      // Skip anchors with rel="external"
      if (anchor.rel === 'external') return false;

      // Skip anchors with data-nprogress="ignore"
      if (anchor.getAttribute('data-nprogress') === 'ignore') return false;

      // Skip hash-only links that stay on the same page
      if (
        onlyHref.startsWith('#') ||
        (onlyHref.startsWith('/#') && onlyHref.indexOf('/', 1) === -1)
      ) {
        return false;
      }

      // Skip javascript: protocol links
      if (targetUrl.startsWith('javascript:')) return false;

      // Skip empty anchor "href"
      if (!targetUrl) return false;

      // Skip control/command/shift/alt+click (opens in new tab or triggers other behavior)
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;

      // Skip if the URL is the same as the current page (no navigation)
      if (targetUrl === location.href) return false;

      return true;
    };

    /**
     * Event delegation: single click listener on document handles all anchor clicks.
     * This replaces the old MutationObserver approach which caused memory leaks
     * by attaching listeners to every anchor on every DOM mutation.
     */
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.('a');
      if (!anchor) return;
      if (shouldTrackNavigation(anchor, event)) {
        startProgress();
      }
    };

    document.addEventListener('click', handleClick, { capture: true });

    /**
     * Proxy both pushState and replaceState to detect navigation completion.
     *
     * Next.js uses pushState for normal navigations and replaceState for
     * middleware redirects, shallow routing, and URL rewrites. The old code
     * only proxied pushState, which is why middleware redirects caused an
     * infinite loading state.
     */
    const originalPushState: HistoryMethod = window.history.pushState;
    const originalReplaceState: HistoryMethod = window.history.replaceState;

    window.history.pushState = function patchedPushState(
      ...args: Parameters<HistoryMethod>
    ) {
      stopProgress();
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function patchedReplaceState(
      ...args: Parameters<HistoryMethod>
    ) {
      stopProgress();
      return originalReplaceState.apply(this, args);
    };

    /**
     * Handle browser back/forward navigation via popstate event.
     */
    const handlePopState = () => {
      stopProgress();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);

      // Restore original history methods to prevent proxy nesting on remount
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;

      if (startTimer) {
        clearTimeout(startTimer);
      }
    };
  }, []);

  return transformCSS(`
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: ${color};
      position: fixed;
      z-index: ${zIndex};
      ${positionStyle}right:0;
      width: 100%;
      height: ${height}px;
      ${isRTL ? 'left: auto !important; right: 0' : ''}
    }
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0;
      width: 100px;
      height: 100%;
      ${boxShadow};
      opacity: 1;
      -webkit-transform: ${shadowTransform};
      -ms-transform: ${shadowTransform};
      transform: ${shadowTransform};
    }
    #nprogress .spinner {
      display: block;
      position: fixed;
      z-index: ${zIndex};
      ${spinnerPositionStyle}
      ${isRTL ? 'left: 15px' : 'right: 15px'}
    }
    #nprogress .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      border: 2px solid transparent;
      border-top-color: ${color};
      border-left-color: ${color};
      border-radius: 50%;
      -webkit-animation: nprogress-spinner 400ms linear infinite;
      animation: nprogress-spinner 400ms linear infinite;
    }
    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }
    .nprogress-custom-parent #nprogress .bar,
    .nprogress-custom-parent #nprogress .spinner {
      position: absolute;
    }
    @-webkit-keyframes nprogress-spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(${spinnerRotationDirection});
      }
    }
    @keyframes nprogress-spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(${spinnerRotationDirection});
      }
    }
  `);
};

export { NextTransitionBar as default, nprogress };

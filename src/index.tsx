'use client';

import * as React from 'react';
import nprogress from './nprogress';

export type NextProgressBarProps = {
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
   *
   */
  zIndex?: number;
  /**
   * To show the TopLoader at bottom.
   * @default false
   *
   */
  showAtBottom?: boolean;
  /**
   * To change the direction of the progressbar
   * @default false
   *
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
};

type PushStateInput = [data: unknown, unused: string, url?: string | URL | null | undefined];

const NextProgressbar = ({
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
    <style nonce={nonce} jsx="true" global="true" precedence="default" href="next-progress-bar">
      {css}
    </style>
  ),
}: NextProgressBarProps) => {
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

  // Check if to show at bottom
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

    const handleAnchorClick = (event: MouseEvent) => {
      const targetElement = event.currentTarget as HTMLAnchorElement;
      const targetUrl = targetElement.href;
      const onlyHref = targetUrl.replace(location.origin, '');

      // Skip anchors with target="_blank"
      if (targetElement.target === '_blank') return;

      // Skip anchors with download attribute
      if (targetElement.hasAttribute('download')) return;

      // Skip external urls
      if (targetUrl && targetUrl.indexOf(location.origin) !== 0) return;

      // Skip anchors with rel="external"
      if (targetElement.rel === 'external') return;

      // Skip anchors with data-nprogress="ignore"
      if (targetElement.getAttribute('data-nprogress') === 'ignore') return;

      // Skip anchors with #, #! or javascript:void(0);
      if (['/#', '#', '/#!', '#!', 'javascript:void(0)'].includes(onlyHref)) return;

      // Skip empty anchor "href" or "href" attribute is not available
      if (!targetUrl || targetUrl === undefined) return;

      // Skip control/command+click
      if (event.metaKey || event.ctrlKey) return;

      const currentUrl = location.href;
      if (targetUrl !== currentUrl) {
        nprogress.start();
      }
    };

    // MutationObserver to handle dynamic anchor elements
    const handleMutation: MutationCallback = () => {
      const anchorElements = document.querySelectorAll('a');

      // Skip anchors with target="_blank" and anchors without href
      const validAnchorELes = Array.from(anchorElements).filter((anchor) => anchor.href && anchor.target !== '_blank');
      validAnchorELes.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick));
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray: PushStateInput) => {
        nprogress.done();
        return target.apply(thisArg, argArray);
      },
    });

    return () => {
      // MutationObserver cleanup
      mutationObserver.disconnect();
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

export { NextProgressbar as default, nprogress };

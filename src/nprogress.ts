interface NProgressSettings {
  minimum: number;
  easing: string;
  speed: number;
  trickle: boolean;
  trickleSpeed: number;
  showSpinner: boolean;
  barSelector: string;
  barLabel: string;
  spinnerSelector: string;
  spinnerLabel: string;
  parent: string;
  template: string;
  isRTL: boolean;
}

interface NProgressInstance {
  configure(options: Partial<NProgressSettings>): NProgressInstance;
  set(value: number): NProgressInstance;
  start(): NProgressInstance;
  done(force?: boolean): NProgressInstance;
  inc(amount?: number): NProgressInstance;
  remove(): void;
  promise($promise: Promise<unknown>): NProgressInstance;
  readonly status: number | null;
  readonly settings: NProgressSettings;
}

const DEFAULTS: NProgressSettings = {
  minimum: 0.08,
  easing: 'linear',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: true,
  isRTL: false,
  barSelector: 'div.bar',
  barLabel: 'processing request',
  spinnerSelector: 'div.spinner',
  spinnerLabel: 'processing request',
  parent: 'body',
  template: `
    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="1">
      <div class="peg"></div>
    </div>
    <div class="spinner" role="progressbar" aria-valuemin="0" aria-valuemax="1">
      <div class="spinner-icon"></div>
    </div>
  `,
};

const NProgress = (): NProgressInstance => {
  const localSettings: NProgressSettings = DEFAULTS;
  let localStatus = 0;
  let initialPromises = 0;
  let currentPromises = 0;

  function isRendered(): boolean {
    return !!document.getElementById('nprogress');
  }

  function isStarted(): boolean {
    return typeof localStatus === 'number';
  }

  function render(): HTMLElement {
    if (isRendered()) {
      return document.getElementById('nprogress') as HTMLElement;
    }

    document.documentElement.classList.add('nprogress-busy');

    const progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = localSettings.template;

    const percentage = isStarted() ? `${localSettings.isRTL ? '100' : '-100'}` : toBarPercentage(localStatus || 0);
    const bar = progress.querySelector(localSettings.barSelector) as HTMLElement;
    bar.setAttribute('aria-label', localSettings.barLabel);
    bar.style.transform = `translate3d(${percentage}%,0,0)`;
    bar.style.transition = 'all 0 linear';

    const spinner = progress.querySelector(localSettings.spinnerSelector) as HTMLElement;
    if (spinner) {
      if (!localSettings.showSpinner) {
        removeElement(spinner);
      } else {
        spinner.setAttribute('aria-label', localSettings.spinnerLabel);
      }
    }

    const parent = document.querySelector(localSettings.parent);
    if (parent) {
      if (parent !== document.body) {
        parent.classList.add('nprogress-custom-parent');
      }

      parent.appendChild(progress);
    }
    return progress;
  }

  function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function toBarPercentage(value: number): number {
    return localSettings.isRTL ? 100 - value * 100 : (-1 + value) * 100;
  }

  function randomInc(status: number): number {
    if (status >= 0 && status < 0.2) {
      return 0.1;
    }
    if (status >= 0.2 && status < 0.5) {
      return 0.04;
    }
    if (status >= 0.5 && status < 0.8) {
      return 0.02;
    }
    if (status >= 0.8 && status < 0.99) {
      return 0.005;
    }
    return 0;
  }

  function removeElement(element: HTMLElement): void {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  const queue = (() => {
    const functionQueue: (() => void)[] = [];

    function next(): void {
      const fn = functionQueue.shift();
      if (fn) {
        fn();
      }
    }

    return (fn: (next: () => void) => void): void => {
      functionQueue.push(() => {
        fn(next);
      });

      if (functionQueue.length === 1) {
        next();
      }
    };
  })();

  return {
    configure(options: Partial<NProgressSettings>): NProgressInstance {
      for (const _key in options) {
        const key = _key as keyof NProgressSettings;
        if (Object.prototype.hasOwnProperty.call(options, key) && Object.prototype.hasOwnProperty.call(DEFAULTS, key)) {
          const value = options[key];
          if (value !== undefined) {
            localSettings[key] = value as never;
          }
        }
      }
      return this;
    },

    set(value: number): NProgressInstance {
      const clamppedValue = clamp(value, localSettings.minimum, 1);
      localStatus = clamppedValue === 1 ? 0 : clamppedValue;

      const progress = render();

      progress.offsetWidth;

      queue((next) => {
        const { speed, easing } = localSettings;
        const bar = progress.querySelector(localSettings.barSelector) as HTMLElement;
        bar.setAttribute('aria-valuenow', clamppedValue.toString());
        bar.style.transform = `translate3d(${toBarPercentage(clamppedValue)}%,0,0)`;
        bar.style.transition = `all ${speed}ms ${easing}`;

        if (clamppedValue === 1) {
          progress.style.transition = 'none';
          progress.style.opacity = '1';

          progress.offsetWidth;

          setTimeout(() => {
            progress.style.transition = `all ${speed}ms linear`;
            progress.style.opacity = '0';
            setTimeout(() => {
              this.remove();
              next();
            }, speed);
          }, speed);
        } else {
          setTimeout(next, speed);
        }
      });

      return this;
    },

    start(): NProgressInstance {
      if (!localStatus) {
        this.set(0);
      }

      const work = () => {
        setTimeout(() => {
          if (!localStatus) {
            return;
          }
          this.inc();
          work();
        }, localSettings.trickleSpeed);
      };

      if (localSettings.trickle) {
        work();
      }

      return this;
    },

    done(force?: boolean): NProgressInstance {
      if (!force && !localStatus) {
        return this;
      }

      const halfRandom = 0.5 * Math.random();
      return this.inc(0.3 + halfRandom).set(1);
    },

    inc(amount: number = randomInc(localStatus)): NProgressInstance {
      if (!localStatus) {
        return this.start();
      }

      const clamppedStatus = clamp(localStatus + amount, 0, 0.994);
      return this.set(clamppedStatus);
    },

    remove(): void {
      document.documentElement.classList.remove('nprogress-busy');
      (document.querySelector(localSettings.parent) as HTMLElement).classList.remove('nprogress-custom-parent');
      const progress = document.getElementById('nprogress');
      if (progress) {
        removeElement(progress);
      }
    },

    promise($promise: Promise<unknown>): NProgressInstance {
      if (currentPromises === 0) {
        this.start();
      }

      initialPromises += 1;
      currentPromises += 1;

      const promiseResolution = () => {
        currentPromises -= 1;
        if (currentPromises === 0) {
          initialPromises = 0;
          this.done();
        } else {
          this.set((initialPromises - currentPromises) / initialPromises);
        }
      };

      $promise.then(promiseResolution).catch(promiseResolution);

      return this;
    },

    get status(): number | null {
      return localStatus;
    },

    get settings(): NProgressSettings {
      return localSettings;
    },
  };
};

export default NProgress();

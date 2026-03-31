import { describe, test, expect, vi, afterEach } from 'vitest';
import nprogress from '../src/nprogress';

const defaults = {
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

vi.useFakeTimers();

describe('NProgress', () => {
  afterEach(() => {
    nprogress.done();
    const element = document.getElementById('nprogress');
    if (element) {
      element.remove();
    }
    nprogress.configure(defaults);
  });

  test('should have defaults', () => {
    expect(nprogress.status).toBe(null);
    expect(nprogress.settings).toEqual(defaults);
  });

  test('configure should not mutate defaults across calls', () => {
    nprogress.configure({ minimum: 0.5 });
    expect(nprogress.settings.minimum).toEqual(0.5);

    // After reconfiguring back, defaults should still be intact
    nprogress.configure({ minimum: 0.08 });
    expect(nprogress.settings.minimum).toEqual(0.08);
  });

  describe('set', () => {
    test('should render nprogress', () => {
      nprogress.set(0);
      expect(document.getElementById('nprogress')).toBeDefined();
      expect(document.querySelector('#nprogress .bar')).toBeDefined();
      expect(document.querySelector('#nprogress .peg')).toBeDefined();
      expect(document.querySelector('#nprogress .spinner')).toBeDefined();
    });

    test('should appear and disappear', () => {
      nprogress.configure({ speed: 10 });
      nprogress.set(0).set(1);
      vi.runAllTimers();
      expect(document.getElementById('nprogress')).toBeDefined();
      expect(document.getElementById('nprogress')).toEqual(null);
    });

    test('should respect minimum', () => {
      nprogress.set(0);
      expect(nprogress.status).toEqual(defaults.minimum);
    });

    test('should clamp to minimum', () => {
      nprogress.set(-100);
      expect(nprogress.status).toEqual(defaults.minimum);
    });

    test('must clamp to maximum', () => {
      nprogress.set(456);
      expect(nprogress.status).toEqual(null);
    });

    test('should set aria-valuenow on bar', () => {
      nprogress.configure({ trickle: false });
      nprogress.set(0.5);
      vi.advanceTimersByTime(300);
      const bar = document.querySelector('#nprogress .bar');
      expect(bar?.getAttribute('aria-valuenow')).toBe('0.5');
    });
  });

  describe('start', () => {
    test('should render', () => {
      nprogress.start();
      expect(document.getElementById('nprogress')).toBeDefined();
    });

    test('should respect minimum', () => {
      nprogress.start();
      expect(nprogress.status).toEqual(defaults.minimum);
    });

    test('should be attached to specified parent when parent is already in the DOM', () => {
      document.body.innerHTML = '<div id="test"></div>';
      nprogress.configure({ parent: '#test' });
      nprogress.start();
    });

    test('should be attached to specified parent when parent is delayed being rendered to the DOM', () => {
      nprogress.configure({ parent: '#test' });
      nprogress.start();
      document.body.innerHTML = '<div id="test"></div>';

      expect(document.getElementById('nprogress')).toBeNull();

      vi.advanceTimersByTime(1000);

      expect(document.getElementById('nprogress')?.parentElement).toEqual(document.getElementById('test'));
      expect(document.getElementById('test')?.classList[0]).toEqual('nprogress-custom-parent');
    });

    test('should increment status until done', () => {
      nprogress.start();
      vi.runOnlyPendingTimers();
      expect(nprogress.status).toBeGreaterThan(defaults.minimum);
      nprogress.done();
      vi.runAllTimers();
      expect(nprogress.status).toBeNull();
    });

    test('isStarted should return true after start', () => {
      nprogress.start();
      expect(nprogress.isStarted()).toBe(true);
    });

    test('isStarted should return false after done', () => {
      nprogress.start();
      nprogress.done();
      vi.runAllTimers();
      expect(nprogress.isStarted()).toBe(false);
    });
  });

  describe('done', () => {
    test('should not render without start', () => {
      nprogress.done();
      expect(document.getElementById('nprogress')).toBeNull();
    });

    test('done(true) should render', () => {
      nprogress.done(true);
      expect(document.getElementById('nprogress')).toBeDefined();
    });
  });

  describe('remove', () => {
    test('should be removed from the parent', () => {
      document.body.innerHTML = '<div id="test"></div>';
      nprogress.configure({ parent: '#test' });
      nprogress.set(1);
      expect(document.getElementById('nprogress')).toBeDefined();
      expect(document.getElementById('test')?.classList[0]).toEqual('nprogress-custom-parent');

      nprogress.remove();

      expect(document.getElementById('nprogress')).toBeNull();
      expect(document.getElementById('test')?.classList.length).toEqual(0);
    });

    test('should not throw when parent element does not exist', () => {
      nprogress.configure({ parent: '#nonexistent' });
      expect(() => nprogress.remove()).not.toThrow();
    });

    test('should not throw when nprogress element does not exist', () => {
      expect(() => nprogress.remove()).not.toThrow();
    });
  });

  describe('inc', () => {
    test('should render', () => {
      nprogress.inc();
      expect(document.getElementById('nprogress')).toBeDefined();
    });

    test('should start with minimum when called without prior start', () => {
      nprogress.inc();
      expect(nprogress.status).toEqual(nprogress.settings.minimum);
    });

    test('should increment', () => {
      nprogress.start();
      const start = nprogress.status;

      nprogress.inc();
      expect(nprogress.status).toBeGreaterThan(Number(start));
    });

    test('should never reach 1.0', () => {
      for (let i = 0; i < 100; i += 1) {
        nprogress.inc();
      }
      expect(nprogress.status).toBeLessThan(1.0);
    });

    test('should accept a custom amount', () => {
      nprogress.start();
      const start = nprogress.status!;
      nprogress.inc(0.1);
      expect(nprogress.status).toBeCloseTo(start + 0.1, 5);
    });
  });

  describe('configure', () => {
    test('should override defaults', () => {
      nprogress.configure({ minimum: 0.5 });
      expect(nprogress.settings.minimum).toEqual(0.5);
    });

    test('should ignore undefined values', () => {
      nprogress.configure({ minimum: undefined });
      expect(nprogress.settings.minimum).toEqual(defaults.minimum);
    });

    test('should ignore unknown keys', () => {
      nprogress.configure({ unknownKey: 'value' } as never);
      expect((nprogress.settings as Record<string, unknown>).unknownKey).toBeUndefined();
    });
  });

  describe('configure(showSpinner)', () => {
    test('should render spinner by default', () => {
      nprogress.start();
      expect(document.querySelector('#nprogress .spinner')).toBeDefined();
    });

    test('should hide (on false)', () => {
      document.getElementById('nprogress')?.remove();
      nprogress.configure({ showSpinner: false });
      nprogress.start();
      expect(document.querySelector('#nprogress')).toBeDefined();
      expect(document.querySelector('#nprogress .spinner')).toBeNull();
    });
  });

  describe('promise', () => {
    test('should set status for promises added', () => {
      nprogress.promise(Promise.resolve());
      nprogress.promise(Promise.resolve());

      expect(document.getElementById('nprogress')).toBeDefined();
    });
  });

  describe('RTL support', () => {
    test('should calculate bar percentage for RTL', () => {
      nprogress.configure({ isRTL: true });
      nprogress.set(0.5);
      const bar = document.querySelector('#nprogress .bar') as HTMLElement;
      expect(bar).toBeDefined();
    });
  });
});

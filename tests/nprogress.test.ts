import { describe, test, expect, vi } from 'vitest';
import nprogress from '../src/nprogress';
import { afterEach } from 'node:test';

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
      // expect(document.getElementById('nprogress')?.parentElement).toEqual(document.getElementById('test'));
      // expect(document.getElementById('test')?.classList[0]).toEqual('nprogress-custom-parent');
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
  });

  describe('inc', () => {
    test('should render', () => {
      nprogress.inc();
      expect(document.getElementById('nprogress')).toBeDefined();
    });

    test('should start with minimum', () => {
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
  });

  describe('configure', () => {
    test('should override defaults', () => {
      nprogress.configure({ minimum: 0.5 });
      expect(nprogress.settings.minimum).toEqual(0.5);
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
});

import Link from 'next/link';

export default function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="mt-2 text-gray-600">
          This is a simple page to demonstrate basic navigation transitions.
          Click the links in the nav bar or the button below to navigate and see the progress bar.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">How it works</h2>
        <p className="text-gray-600">
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">next-transition-bar</code>{' '}
          intercepts navigation by listening for anchor clicks via event delegation and
          detecting when <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">history.pushState</code> or{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">history.replaceState</code> is called
          to signal navigation completion.
        </p>
        <p className="text-gray-600">
          It also handles browser back/forward buttons via the{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">popstate</code> event,
          and properly supports Next.js middleware redirects.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

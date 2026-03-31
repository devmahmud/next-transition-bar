import Link from 'next/link';

export default function RedirectTarget() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Redirect Target</h1>
        <p className="mt-2 text-gray-600">
          You arrived here! If you navigated from{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">/old-path</code>, the middleware
          redirected you to this page using <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">replaceState</code>.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Test the middleware redirect</h2>
        <p className="text-gray-600">
          Click the link below to navigate to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">/old-path</code>.
          The middleware will redirect you back here. The progress bar should start and then
          complete normally — no infinite loading.
        </p>
        <Link
          href="/old-path"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to /old-path (will redirect here)
        </Link>
      </div>

      <Link
        href="/"
        className="inline-block border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

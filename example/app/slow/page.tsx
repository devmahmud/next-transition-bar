import Link from 'next/link';

async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { loadedAt: new Date().toISOString() };
}

export default async function SlowPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Slow Page</h1>
        <p className="mt-2 text-gray-600">
          This page has a 2-second simulated delay. The progress bar should be visible
          during the loading time.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <p className="text-gray-600">
          Data loaded at:{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{data.loadedAt}</code>
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

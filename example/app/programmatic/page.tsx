'use client';

import { useRouter } from 'next/navigation';

export default function ProgrammaticNav() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Programmatic Navigation</h1>
        <p className="mt-2 text-gray-600">
          These buttons use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">router.push()</code> and{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">router.replace()</code> to navigate.
          The progress bar should work for both.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">router.push()</h2>
        <p className="text-sm text-gray-500">Adds a new entry to the browser history stack.</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Push to Home
          </button>
          <button
            onClick={() => router.push('/about')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Push to About
          </button>
          <button
            onClick={() => router.push('/slow')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Push to Slow Page
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">router.replace()</h2>
        <p className="text-sm text-gray-500">Replaces the current history entry (uses replaceState).</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.replace('/')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Replace with Home
          </button>
          <button
            onClick={() => router.replace('/about')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Replace with About
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">router.back() / router.forward()</h2>
        <p className="text-sm text-gray-500">Browser history navigation (triggers popstate).</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => router.forward()}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Go Forward
          </button>
        </div>
      </div>
    </div>
  );
}

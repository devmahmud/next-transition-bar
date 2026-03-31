import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">next-transition-bar</h1>
        <p className="mt-2 text-gray-600">
          A lightweight, customizable progress bar for Next.js page transitions.
          Works with both App Router and Pages Router.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          href="/about"
          title="Basic Navigation"
          description="Standard client-side navigation between pages."
        />
        <Card
          href="/slow"
          title="Slow Page"
          description="Page with a simulated delay — see the progress bar in action."
        />
        <Card
          href="/redirect-target"
          title="Middleware Redirect"
          description="Navigates to /old-path which middleware redirects to /redirect-target."
        />
        <Card
          href="/programmatic"
          title="Programmatic Navigation"
          description="Navigate using router.push() and router.replace()."
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Works with App Router and Pages Router
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Handles middleware redirects (pushState + replaceState)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Browser back/forward button support
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Zero memory leaks — event delegation instead of per-element listeners
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Customizable color, height, speed, easing, spinner, and more
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            RTL support
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">&#10003;</span>
            Optional start delay to avoid flashing on fast navigations
          </li>
        </ul>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Links</h2>
        <ul className="space-y-1 text-gray-600">
          <li>
            <a
              href="https://www.npmjs.com/package/next-transition-bar"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              npm package
            </a>
          </li>
          <li>
            <a
              href="https://github.com/devmahmud/next-transition-bar"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              GitHub repository
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Card({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="block border border-gray-200 rounded-lg p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}

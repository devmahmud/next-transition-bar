import Link from 'next/link';
import Features from '../Features';

export default function About() {
  return (
    <main>
      <div className="border border-gray-200 rounded-md p-5 py-10">
        <div className="flex gap-10">
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to home page
            </button>
          </Link>

          <ul className="list-disc">
            <li>
              Checkout the NPM Package! -{' '}
              <a
                href="https://www.npmjs.com/package/next-transition-bar"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Click here!
              </a>
            </li>
            <li>
              Checkout the NextTransitionBar Github repository and contribute!{' '}
              <a
                href="https://github.com/devmahmud/next-transition-bar"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Click here!
              </a>
            </li>
          </ul>
        </div>
        <Features />
      </div>
    </main>
  );
}

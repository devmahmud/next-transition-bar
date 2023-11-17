import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: string;
    global?: string;
    precedence?: string;
    href?: string;
  }
}

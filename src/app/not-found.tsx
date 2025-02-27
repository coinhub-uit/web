import Link from 'next/link';

export default async function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="">
        <h2>Oops!</h2>
        <p>Could not find requested resource</p>
        <button className="btn btn-xs">
          {' '}
          <Link href="/">Home</Link>
        </button>
      </div>
    </div>
  );
}

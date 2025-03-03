import Link from 'next/link';

export default async function NotFound() {
  return (
    <div className="bg-base-200 flex h-screen w-screen items-center justify-center">
      <div className="card bg-base-100 w-96 shadow-2xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Oops!</h2>
          <p className="my-4">Page not found</p>
          <div className="card-actions justify-end">
            <Link className="btn btn-primary" href="/">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";

const NotFoundPage = () => {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-8">
        Page Not Found
      </h2>

      <p className="text-xl text-gray-600 mb-8">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>

      <Link href="/">
        <a className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-gray-600 transition-colors">
          Return to Home
        </a>
      </Link>
    </div>
  );
};

export default NotFoundPage;

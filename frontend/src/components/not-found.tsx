import { FaBug } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <FaBug size={56} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          404 – Page Not Found
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

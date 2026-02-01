import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <FaLock size={56} className="text-yellow-500" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          403 – Access Denied
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Sorry, you don’t have permission to access this page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Go back home
          </Link>

          <Link
            to="/signin"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/80 transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

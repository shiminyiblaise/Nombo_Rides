import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MapPin, ArrowLeft } from "lucide-react";

const LOGO_URL = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src={LOGO_URL} alt="Nombo" className="h-10 w-10 object-contain rounded" />
          <span className="text-xl font-bold text-gray-900">NOMBO</span>
        </div>
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-yellow-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-xl text-gray-600 mb-2">Looks like you took a wrong turn!</p>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

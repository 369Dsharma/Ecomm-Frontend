import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <p className="mt-3 font-bold">Page Not Found 404!</p>
      <Link to="/" className="mt-3 text-blue-500">
        Home
      </Link>
    </div>
  );
};

export default NotFound;

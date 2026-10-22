import { Link } from "react-router";

import "./Page.css";

function NotFound() {
  return (
    <main className="page-message">
      <div className="page-message-card">
        <p className="page-message-label">
          STAYEASE
        </p>

        <div className="page-message-code">
          404
        </div>

        <h1>
          Page Not Found
        </h1>

        <p>
          The page you are looking for doesn't exist
          or may have been moved.
        </p>

        <div className="page-message-actions">
          <Link
            to="/"
            className="page-message-primary"
          >
            Back to Home
          </Link>

          <Link
            to="/hotels"
            className="page-message-secondary"
          >
            Explore Hotels
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
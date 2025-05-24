import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function Footer() {
  return (
    <footer className="bg-success text-light py-3">
      <div className="container text-center">
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <span>ecotechsdee@gmail.com</span>
          <span>felipeffernandes2007@gmail.com</span>
          <span>gabris.trajano@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function Footer() {
  return (
   <footer className="text-light py-2 fixed-bottom" style={{ backgroundColor: '#3b5534', zIndex: 1000, width: '100%' }}>
      <div className="container text-center">
        <div className="d-flex justify-content-center flex-wrap gap-5">
          <span>ecotechsdee@gmail.com</span>
          <span>felipeffernandes2007@gmail.com</span>
          <span>gabris.trajano@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}

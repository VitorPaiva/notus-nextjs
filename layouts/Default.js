import React from "react";

// components

import Navbar from "components/Navbars/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

export default function Default({ children }) {
  return (
    <>
      {<Sidebar />}
      <div className="lg:ml-56 bg-slate-100">
        <Navbar />
        {/* Header */}
        {/*<HeaderStats />*/}
        <div className="px-4 lg:px-10 mx-auto w-full pt-24">
          {children}
        </div>
      </div>
    </>
  );
}

// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     // Delay to let DOM update first
//     setTimeout(() => {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: "smooth",
//       });
//     }, 50);
//   }, [pathname]);

//   return null;
// }

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Find the main-content div and scroll it
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return null;
}

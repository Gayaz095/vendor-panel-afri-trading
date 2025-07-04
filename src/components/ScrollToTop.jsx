// import { useLayoutEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
//   const { pathname } = useLocation();
//   useLayoutEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   }, [pathname]);
//   return null;
// }

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window to the top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

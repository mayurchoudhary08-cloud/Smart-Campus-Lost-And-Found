import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Ensures that whenever the route changes (e.g. clicking an item from the
 * homepage or navigating between tabs), the window immediately resets to the top.
 * Prevents the jarring bug where navigating to an item card opens the page
 * already scrolled down to the bottom.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname, search]);

  return null;
}

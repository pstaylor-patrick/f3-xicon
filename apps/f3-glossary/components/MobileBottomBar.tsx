import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RegionsNearMeButton } from './regions-near-me-button';

// Renders the bottom bar in a portal to ensure it is always fixed to the viewport bottom,
// unaffected by parent containers' CSS (e.g., overflow, stacking context).
export function MobileBottomBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 flex justify-center py-3 sm:hidden">
      <RegionsNearMeButton />
    </div>,
    document.body
  );
}

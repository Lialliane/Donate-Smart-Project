import { useState } from 'react'
import { Link } from "react-router-dom";

const MobileHeaderLink = ({ item, closeMenu }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false)

  return (
    <div className="w-full">
      {item.submenu ? (
        <button
          onClick={() => setSubmenuOpen(!submenuOpen)}
          className="flex w-full justify-between py-2 text-black"
        >
          {item.label}
          ▼
        </button>
      ) : (
        <Link
          to={item.href}
          onClick={closeMenu}
          className="block py-2 text-black hover:text-[var(--color-primary)]">
          {item.label}
        </Link>
      )}

      {submenuOpen && item.submenu && (
        <div className="pl-4">
          {item.submenu.map((sub, i) => (
            <Link
              key={i}
              to={sub.href}
              onClick={closeMenu}
              className="block py-2 text-gray-600"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;

import { useState } from 'react'
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const HeaderLink = ({ item }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
   const location = useLocation()
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true)
    }
  }
  const handleMouseLeave = () => {
    setSubmenuOpen(false)
  }

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {!currentUser && (<a
        href={item.href}
        className={`text-base flex font-medium hover:text-[var(--color-primary)] capitalized  ${
          location.pathname === item.href ? 'text-[var(--color-primary)] ' : 'text-[var(--color-text-light)]'
        }`}>
        {item.label}
        {item.submenu && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.5em'
            height='1.5em'
            viewBox='0 0 24 24'>
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='m7 10l5 5l5-5'
            />
          </svg>
        )}
      </a>)}
      {currentUser && (<Link
        to={item.href}
        className={`text-base flex font-medium hover:text-[var(--color-primary)] capitalized  ${
          location.pathname === item.href  ? 'text-[var(--color-primary)] ' : 'text-black'
        }`}>
        {item.label}
        {item.submenu && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1.5em'
            height='1.5em'
            viewBox='0 0 24 24'>
            <path
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              d='m7 10l5 5l5-5'
            />
          </svg>
        )}
      </Link>)}
      {submenuOpen && (
        <div
          className={`absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-darklight dark:text-white shadow-lg rounded-lg `}
          data-aos='fade-up'
          data-aos-duration='500'>
          {item.submenu?.map((subItem, index) => (
            (currentUser &&
              <Link
              to={subItem.href}
              className={`block px-4 py-2   ${
                location.pathname === subItem.href
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-black dark:text-white hover:bg-[var(--color-primary)]'
              }`}>
              {subItem.label}
            </Link>
            )
            (!currentUser &&
              <a
              key={index}
              href={subItem.href}
              className={`block px-4 py-2   ${
                location.pathname === subItem.href
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-black dark:text-white hover:bg-[var(--color-primary)]'
              }`}>
              {subItem.label}
            </a>
            )))}
        </div>
      )}
    </div>
  )
}

export default HeaderLink

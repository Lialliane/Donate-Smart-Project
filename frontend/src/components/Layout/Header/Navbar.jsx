import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from './Logo/Logo'
import HeaderLink from './Navigation/HeaderLink'
import MobileHeaderLink from './Navigation/MobileHeaderLink'
import Signin from '../../Auth/SignIn/SignIn'
import SignUp from '../../Auth/SignUp/SignUp'
import { logoutUser } from "../../../redux/userSlice";
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast'


const Navbar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);


  // instead of writing document.getElementById("nav")
  const signInRef = useRef(null);
  const signUpRef = useRef(null);
  const mobileMenuRef = useRef(null)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let headerData = [];

  if (currentUser?.role === "user") {
    headerData = [
      { label: 'Home', href: '/' },
      { label: 'Cases', href: '/cases' },
      { label: 'Add Case', href: '/add-case' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Profile', href: '/profile' },
    ]
  }
  else if (currentUser?.role === "admin") {
    headerData = [
      { label: 'Home', href: '/' },
      { label: 'Admin Panel', href: '/admin' },
      { label: 'Cases', href: '/cases' },
      { label: 'Profile', href: '/profile' },
    ]
  }
  else {
    headerData = [
      { label: 'Home', href: '/' },
      { label: 'All Cases', href: '/cases' },
      { label: 'Contact Us', href: '/contact' },
    ]
  }

  const handleScroll = () => {
    setSticky(window.scrollY >= 10)
  }

  //close signin/up menu when clicking outside
  const handleClickOutside = (event) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target) &&
      !event.target.closest(".toast")
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target) &&
      !event.target.closest(".toast")
    ) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      navbarOpen &&
      !event.target.closest(".toast")
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  const signOutUser = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm transition-all duration-300 
        ${sticky ? ' shadow-lg py-1' : 'shadow-sm py-0'
        }`}>
      <div className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <Logo />
          <nav className='hidden lg:flex items-center gap-8'>
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>
          {/* sign in/up buttons and popup menu */}
          <div className='flex items-center gap-4'>
            {!currentUser && (<button
              className='hidden lg:block bg-transparent text-[var(--color-primary)] border hover:bg-[var(--color-primary)] border-[var(--color-primary)] hover:text-white duration-300 px-6 py-2 rounded-full hover:cursor-pointer shadow-md hover:shadow-lg'
              onClick={() => {
                setIsSignInOpen(true)
              }}>
              Sign In
            </button>)}
            {currentUser && (<button
              className='hidden lg:block bg-transparent text-[var(--color-primary)] border hover:bg-[var(--color-primary)] border-[var(--color-primary)] hover:text-white duration-300 px-6 py-2 rounded-full hover:cursor-pointer shadow-md hover:shadow-lg'
              onClick={() => {
                signOutUser();
              }}>
              Sign out
            </button>)}
            {isSignInOpen && (
              <div className='fixed top-0  left-0 w-full h-screen bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signInRef}
                  className='relative mx-auto h-[95vh] w-full max-w-md overflow-auto rounded-lg px-8 pt-14 pb-8 text-center bg-dark_grey/90 backdrop-blur-md bg-white'>
                  <button
                    onClick={() => setIsSignInOpen(false)}
                    className='absolute top-0 right-0 mr-8 mt-8'
                    aria-label='Close Sign In Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-[var(--color-primary)] inline-block hover:cursor-pointer'
                    />
                  </button>
                  <Signin setIsSignInOpen={setIsSignInOpen} setIsSignUpOpen={setIsSignUpOpen} />
                </div>
              </div>
            )}
            {!currentUser && (<button
              className='hidden lg:block bg-[var(--color-primary)] text-white text-base font-medium hover:bg-transparent duration-300 hover:text-[var(--color-primary)] border border-[var(--color-primary)] px-6 py-2 rounded-full hover:cursor-pointer shadow-md hover:shadow-lg'
              onClick={() => {
                setIsSignUpOpen(true)
              }}>
              Sign Up
            </button>)}
            {isSignUpOpen && (
              <div className='fixed top-0 left-0 w-full h-screen bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signUpRef}
                  className='relative mx-auto h-[95vh] bg-white w-full max-w-md overflow-auto rounded-lg bg-dark_grey/90 backdrop-blur-md px-8 pt-14 pb-8 text-center'>
                  <button
                    onClick={() => setIsSignUpOpen(false)}
                    className='absolute top-0 right-0 mr-8 mt-8'
                    aria-label='Close Sign Up Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-[var(--color-primary)] inline-block hover:cursor-pointer'
                    />
                  </button>
                  <SignUp setIsSignInOpen={setIsSignInOpen} setIsSignUpOpen={setIsSignUpOpen} />
                </div>
              </div>
            )}
            {/* mobile navbar */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'>
              <span className='block w-6 h-0.5 bg-black'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-45' />
        )}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-screen w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${navbarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}>
          <div className='flex items-center justify-between p-4'>
            <h2 className='text-lg font-bold text-midnight_text'>
              <Logo />
            </h2>
            <button
              onClick={() => setNavbarOpen(false)}
              className='bg-black/30 rounded-full p-1 text-white'
              aria-label='Close menu Modal'>
              <Icon
                icon={'material-symbols:close-rounded'}
                width={24}
                height={24}
              />
            </button>
          </div>
          <nav className='flex flex-col items-start p-4'>
            {headerData.map((item, index) => (
              <MobileHeaderLink
                key={index}
                item={item}
                closeMenu={() => setNavbarOpen(false)}
              />
            ))}


            <div className='mt-4 flex flex-col gap-4 w-full'>
              {currentUser && (<button
                className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg border  border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                onClick={() => {
                  signOutUser();
                }}>
                Sign Out
              </button>)}
              {!currentUser && (
                <button
                  className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg border  border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                  onClick={() => {
                    setIsSignInOpen(true)
                    setNavbarOpen(false)
                  }}>
                  Sign In
                </button>)}
              {!currentUser && (<button
                className='bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg border  border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                onClick={() => {
                  setIsSignUpOpen(true)
                  setNavbarOpen(false)
                }}>
                Sign Up
              </button>)}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar;

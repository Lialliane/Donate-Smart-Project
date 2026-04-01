import { useState } from 'react'
import toast from 'react-hot-toast'
import GoogleSignIn from '../GoogleSignIn'
import Logo from '../../Layout/Header/Logo/Logo'
import Loader from '../../Common/Loader'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";

const Signin = ({setIsSignInOpen, setIsSignUpOpen}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    checkboxToggle: false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", loginData);

      localStorage.setItem("token", res.data.token);
      dispatch(setUser(res.data.user));
      toast.success("Successfully logged in");
      setIsSignInOpen(false);
      if(res.data.user?.role === "user")
        navigate("/");
      else
        navigate("/admin");
    } 
    catch (err) {
        const message = err.response?.data?.message || err.response?.data || err.message || "Login failed";
        console.log(err);
        toast.error(message);
    } 
    finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className='text-center justify-self-center block'>
        <Logo />
      </div>
      <GoogleSignIn />
      <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-[40%] before:bg-black/20 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-[40%] after:bg-black/20 after:top-3 after:right-0">
        <span className='text-body-secondary relative z-10 inline-block px-3 text-base text-black'>
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='Email'
            required
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-[var(--color-primary)] focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Password'
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-[var(--color-primary)] focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            className='bg-[var(--color-primary)] w-full py-3 rounded-lg text-18 font-medium border text-white border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
            Sign In {loading && <Loader />}
          </button>
        </div>
      </form>

      <a
        href='/'
        className='mb-2 inline-block text-base text-[var(--color-primary)] hover:underline'>
        Forgot Password?
      </a>
      <p className='text-body-secondary text-black text-base'>
        Not a member yet?{' '}
        <button onClick={() => {
                setIsSignInOpen(false);
                setIsSignUpOpen(true);
              }} className='text-[var(--color-primary)] hover:underline'>
          Sign Up
        </button>
      </p>
    </>
  )
}

export default Signin

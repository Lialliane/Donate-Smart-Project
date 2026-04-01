import { Link } from "react-router-dom";

const Logo = ({revert}) => {
  return (
    <Link to={"/"}  className='flex items-center gap-2'>
      <img
        className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10"
        src={`/images/logo/${revert? "logo2.svg" : "logo.svg" }`}
        alt="logo"
      />
      <span className="text-lg sm:text-2xl font-semibold text-[var(--color-text-dark)]">DonateSmart</span>
    </Link>
    
  );
};

export default Logo;

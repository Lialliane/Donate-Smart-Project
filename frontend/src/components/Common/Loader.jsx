import React from "react";

const Loader = () => {
  return (
    <span
      className={`block justify-self-center ml-1.5 h-6 w-6 animate-spin rounded-full border-2 border-solid border-[var(--color-text-dark)] border-t-transparent dark:border-t-transparent`}
    ></span>
  );
};

export default Loader;

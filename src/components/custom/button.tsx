import React from "react";

const ButtonOutline = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="duration-400 transform rounded-lg border border-black bg-transparent px-6 py-2 font-bold text-black shadow-[0_0_0_3px_#000000_inset] transition hover:-translate-y-1 dark:border-white dark:text-white">
      {children}
    </button>
  );
};

export default ButtonOutline;

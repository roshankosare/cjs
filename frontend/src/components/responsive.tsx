
import React from "react";
import clsx from "clsx";

type ResponsiveProps = {
  className?: string;
  children: React.ReactNode;
};

const Responsive = ({ className, children }: ResponsiveProps) => {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Responsive;

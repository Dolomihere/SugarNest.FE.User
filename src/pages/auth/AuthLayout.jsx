import React from "react";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children, imageSrc = "/public/images/sign-in.png" }) {
  return (
    <div className="relative p-6 bg-white dark:bg-gray-900 text-[#5C4033] dark:text-[#f5deb3] sm:p-0 min-h-screen">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row">
        <div className="w-full max-h-screen px-6 overflow-y-auto lg:w-1/2 sm:px-12 custom-scrollbar">
          {children}
        </div>
        <div className="hidden w-full h-full lg:w-1/2 lg:block">
          <img src={imageSrc} alt="SugarNest Illustration" className="object-cover w-full h-full" />
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        </div>
      </div>
    </div>
  );
}
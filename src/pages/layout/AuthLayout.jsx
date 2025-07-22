import { Outlet, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const location = useLocation();

  const imageMap = {
    '/auth/signin': '/src/assets/sign-in.png',
    '/auth/signup': '/src/assets/sign-up.png',
  };

  const backgroundImage = imageMap[location.pathname] || null;

  return (
    <div className="relative p-6 bg-white dark:bg-gray-900 text-[#5C4033] dark:text-[#f5deb3] sm:p-0 min-h-screen">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row">

        <div className="w-full max-h-screen px-6 overflow-y-auto lg:w-1/2 sm:px-12 custom-scrollbar">
          <Outlet />
        </div>

        {backgroundImage && (
          <div className="hidden w-full h-full lg:w-1/2 lg:block">
            <img
              src={backgroundImage}
              alt="SugarNest Illustration"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block"></div>

      </div>
    </div>
  );
}

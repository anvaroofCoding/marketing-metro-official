import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import { useGetAuthQuery } from "./services/api";
import { message } from "antd";
import { useEffect } from "react";

const App = () => {
  const location = useLocation();
  const { data, isLoading, error } = useGetAuthQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      const lastShown = localStorage.getItem("token_check_success");
      const now = new Date();

      if (
        !lastShown ||
        new Date(lastShown).toDateString() !== now.toDateString()
      ) {
        message.success({
          content: "Token tekshiruvi!",
          duration: 5,
          closable: true,
        });
        localStorage.setItem("token_check_success", now.toISOString());
      }
    }
  }, [isLoading]);

  useEffect(() => {
    // ✅ ERROR har 10 soniyada tekshiriladi
    if (error) {
      const interval = setInterval(() => {
        message.error({
          content: "Profilingizdan chiqib qayta kiring iltimos",
          duration: 5,
          closable: true,
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [error]);

  // boshidagi va oxiridagi / belgilardan tozalab olamiz
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const segments = path.split("/");

  const segment = segments[0]; // "map"

  const tokens = localStorage.getItem("token_marketing");
  if (!tokens) {
    navigate("/login");
  }
  return (
    <div className="flex roboto">
      <Sidebar />

      <div
        className={`relative w-full h-screen p-4 ${
          segment === "map" ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        {/* Background with pattern */}
        <div
          className="fixed inset-0 
             bg-[url('/naqsh1.jpg')] 
             bg-repeat 
             bg-center 
             bg-[length:100px_100px] 
             opacity-15 
             pointer-events-none
             -z-10" /* content orqasida turishi uchun */
        ></div>

        {/* Content */}
        <div className="relative z-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;

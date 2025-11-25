import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetDelaysQuery,
  useGetMeQuery,
  useGetNotiveQuery,
} from "@/services/api";
import { Modal, Spin } from "antd";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LogOut,
  Map,
  Search,
  TextSearch,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(["/delays/"]);
  const [collapsed, setCollapsed] = useState(false);
  const { data: notiveData, isLoading: Endloading } = useGetNotiveQuery();
  const [onlineTime, setOnlineTime] = useState("00:00");
  const { data: userData, isLoading } = useGetMeQuery();
  const { data: deleyEnd, isLoading: delaysEndLoading } = useGetDelaysQuery();
  useEffect(() => {
    const savedStart = localStorage.getItem("sessionStart");
    if (!savedStart) return; // login qilmagan bo‘lsa
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = now - parseInt(savedStart, 10);
      if (diff >= 9 * 60 * 60 * 1000) {
        setOnlineTime("00:00");
        localStorage.removeItem("sessionStart");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setOnlineTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (isLoading || Endloading || delaysEndLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-85 ">
        <Spin />
      </div>
    );
  }
  const menuItems = [
    {
      key: "/",
      icon: <Home size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Dashboard</span>
        </div>
      ),
    },

    {
      key: "/map/",
      icon: <Map size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Xarita</span>
        </div>
      ),
    },
    {
      key: "/archive/",
      icon: <Archive size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Arxiv</span>
        </div>
      ),
    },
    {
      key: "/umumiy-qidiruv/",
      icon: <Search size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Umumiy reklamalar</span>
        </div>
      ),
    },
    {
      key: "/delays/",
      icon: <Clock size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Shartnomalar muddati</span>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-900 hover:bg-green-100 ml-2"
          >
            {deleyEnd?.counts.haftada_tugaydigan + deleyEnd?.counts.tugagan}
          </Badge>
        </div>
      ),
      children: [
        {
          key: "/delay7/",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Oxirgi hafta</span>
              <Badge
                variant="secondary"
                className="bg-orange-500 text-white hover:bg-orange-600 ml-2"
              >
                {deleyEnd?.counts.haftada_tugaydigan}
              </Badge>
            </div>
          ),
        },
        {
          key: "/delaysEnd/",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Tugaganlar</span>
              <Badge
                variant="secondary"
                className="bg-red-500 text-white hover:bg-red-600 ml-2"
              >
                {deleyEnd?.counts.tugagan}
              </Badge>
            </div>
          ),
        },
      ],
    },
    {
      key: "/Royxatlash",
      icon: <TextSearch size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Ro'yxatga olish</span>
        </div>
      ),
      children: [
        {
          key: "/tashkilotni-royxatga-olish",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Tashkilodlar</span>
            </div>
          ),
        },
        {
          key: "/Banner",
          label: (
            <div className="flex justify-between items-center w-full">
              <span>Reklama Bannerlar</span>
            </div>
          ),
        },
      ],
    },
    {
      key: "/train",
      icon: <TextSearch size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Poyezdlarni ro'yxatlash </span>
        </div>
      ),
    },
    {
      key: "/dastur-haqida",
      icon: <Home size={20} />,
      label: (
        <div className="flex justify-between items-center w-full">
          <span>Dastur haqida</span>
        </div>
      ),
    },
  ];

  const toggleExpanded = (key) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleNavigation = (key) => {
    navigate(key);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Chiqishni tasdiqlang",
      content: "Rostan ham tizimdan chiqmoqchimisiz?",
      okText: "Ha, chiqaman",
      cancelText: "Bekor qilish",
      okType: "danger",
      centered: true,
      onOk: () => {
        localStorage.removeItem("token_marketing");
        window.location.href = "/login"; // agar boshqa sahifaga o‘tkazish kerak bo‘lsa
      },
    });
  };

  const renderMenuItem = (item, level = 0) => {
    const isActive = location.pathname === item.key;
    const isExpanded = expandedItems.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="w-full">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.key);
            } else {
              handleNavigation(item.key);
            }
          }}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 mb-1
            ${level > 0 ? "ml-6 pl-8" : ""}
            ${
              isActive
                ? "bg-gradient-to-r bg-green-600 text-white shadow-lg "
                : "text-white  hover:bg-green-500 hover:text-white"
            }
          `}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className={isActive ? "text-white" : "text-white"}>
                {item.icon}
              </span>
            )}
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {hasChildren && !collapsed && (
            <span className="text-white font-bold">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-4">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-screen  bg-[#155d27]   
             flex flex-col transition-all relative  duration-300 ${
               collapsed ? "w-20" : "w-85"
             }`}
    >
      <div
        className="absolute inset-0 
             bg-[url('/naqshtitle.png')] 
             bg-repeat 
             bg-center 
             bg-[length:400px_400px] 
             opacity-20
             pointer-events-none
             z-0"
      ></div>
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Link to={"/"}>
              <img src="/logos.png" alt="metro logo" className="w-10" />
            </Link>
            <h1 className="text-2xl font-bold text-white solid">Marketing</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white p-2 rounded-full hover:bg-green-900 transition"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1 relative z-10 ">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Account Section */}
      {!collapsed && (
        <div className="p-4 relative z-10 ">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-green-600">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-green-900" />
            </div>
            <div className="flex-1">
              <p className="text-md font-medium text-white truncate">
                {userData?.username}
              </p>

              <p className="text-xs text-gray-100 font-bold"> ⏱ {onlineTime}</p>
            </div>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start bg-red-600 text-gray-100 hover:text-white hover:bg-red-800 transition-colors"
          >
            <LogOut size={20} className="mr-3 text-white" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}

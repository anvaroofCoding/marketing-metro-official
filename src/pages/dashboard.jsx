import {
  useGetStatistikcPhotosQuery,
  useGetStatistikcQuery,
} from "../services/api";
import { useRef, useState, useEffect } from "react";
import {
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  BarChart3Icon,
  PlayCircleIcon,
  StarIcon,
  MapPinIcon,
  ChevronLeft,
  ChevronRight,
  ActivityIcon,
  TargetIcon,
  ZapIcon,
} from "lucide-react";
import { Spin } from "antd";

const Dashboard = () => {
  const { data: StatistikData, isLoading } = useGetStatistikcQuery();
  const { data: statistikPhotosData, isLoading: statistikLoading } =
    useGetStatistikcPhotosQuery();
  // const carouselRef = useRef(null);
  const [animatedCards, setAnimatedCards] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animate cards on load
  useEffect(() => {
    if (StatistikData?.counts) {
      StatistikData.counts.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => [...prev, index]);
        }, index * 200);
      });
    }
  }, [StatistikData]);

  // Auto-advance carousel
  useEffect(() => {
    if (statistikPhotosData && statistikPhotosData.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % statistikPhotosData.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [statistikPhotosData]);

  const getStatIcon = (index) => {
    const icons = [
      <TrendingUpIcon key="icon1" className="w-6 h-6" />,
      <UsersIcon key="icon2" className="w-6 h-6" />,
      <DollarSignIcon key="icon3" className="w-6 h-6" />,
      <BarChart3Icon key="icon4" className="w-6 h-6" />,
      <ActivityIcon key="icon5" className="w-6 h-6" />,
      <TargetIcon key="icon6" className="w-6 h-6" />,
      <ZapIcon key="icon7" className="w-6 h-6" />,
    ];
    return icons[index % icons.length];
  };

  const getStatColor = (index) => {
    const colors = [
      {
        bg: "from-emerald-500 via-emerald-600 to-teal-600",
        accent: "emerald-500",
        glow: "emerald-500/20",
      },
      {
        bg: "from-blue-500 via-blue-600 to-indigo-600",
        accent: "blue-500",
        glow: "blue-500/20",
      },
      {
        bg: "from-violet-500 via-purple-600 to-indigo-600",
        accent: "violet-500",
        glow: "violet-500/20",
      },
      {
        bg: "from-orange-500 via-red-500 to-pink-600",
        accent: "orange-500",
        glow: "orange-500/20",
      },
      {
        bg: "from-cyan-500 via-teal-600 to-blue-600",
        accent: "cyan-500",
        glow: "cyan-500/20",
      },
      {
        bg: "from-rose-500 via-pink-600 to-purple-600",
        accent: "rose-500",
        glow: "rose-500/20",
      },
      {
        bg: "from-amber-500 via-yellow-600 to-orange-600",
        accent: "amber-500",
        glow: "amber-500/20",
      },
    ];
    return colors[index % colors.length];
  };

  if (isLoading || statistikLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  const nextSlide = () => {
    if (statistikPhotosData) {
      setCurrentSlide((prev) => (prev + 1) % statistikPhotosData.length);
    }
  };

  const prevSlide = () => {
    if (statistikPhotosData) {
      setCurrentSlide(
        (prev) =>
          (prev - 1 + statistikPhotosData.length) % statistikPhotosData.length
      );
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      {/* Header with enhanced gradient and animation */}
      <div className="relative bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-3xl border border-slate-200/20 p-8 mb-8 mx-4 mt-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10">
          <h1 className="font-bold text-4xl text-white mb-2 animate-fade-in">
            Reklamalar Statistikasi
          </h1>
          <p className="text-blue-200 text-lg animate-fade-in-delay">
            Hozirgi vaqtdagi reklama statistikasi va tahlil
          </p>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {StatistikData?.counts?.map((item, index) => {
            const colors = getStatColor(index);
            const isAnimated = animatedCards.includes(index);

            return (
              <div
                key={item.id}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isAnimated ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bg} rounded-full animate-pulse`}
                    style={{
                      width: `${Math.min((item.value / 1000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {getStatIcon(index)}
                    </div>
                    <div
                      className={`w-2 h-2 bg-${colors.accent} rounded-full animate-pulse`}
                    ></div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-slate-800 tabular-nums">
                      {item.value.toLocaleString()}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 capitalize tracking-wide">
                      {item.color || "Metric"}
                    </div>
                  </div>

                  {/* Animated progress indicator */}
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${Math.min((item.value / 1000) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {Math.min(Math.round((item.value / 1000) * 100), 100)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Enhanced Top Performing Ads with Infinite Vertical Scroll */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Shartnoma qimati eng yuqori reklamalar
            </h2>
          </div>

          <div className="relative h-96 overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg">
            <div className="animate-scroll-vertical space-y-4 p-4">
              {/* First set of ads */}
              {StatistikData?.top_5_ads?.map((items, index) => {
                const summa = Number(items.Shartnoma_summasi);
                const getStarsBySumma = (sum) => {
                  if (sum < 10000000) return 1;
                  if (sum < 20000000) return 2;
                  if (sum < 30000000) return 3;
                  if (sum < 40000000) return 4;
                  return 5;
                };

                return (
                  <div
                    key={`first-${items.id}`}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="relative">
                          <img
                            src={items.photo || "/placeholder.svg"}
                            width={64}
                            height={64}
                            alt={items.Reklama_nomi}
                            className="rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {items.Reklama_nomi}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-sm">
                              {summa.toLocaleString("uz-UZ")} Som
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < getStarsBySumma(summa)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          #{index + 1} Top
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Duplicate set for seamless loop */}
              {StatistikData?.top_5_ads?.map((items, index) => {
                const summa = Number(items.Shartnoma_summasi);
                const getStarsBySumma = (sum) => {
                  if (sum < 10000000) return 1;
                  if (sum < 20000000) return 2;
                  if (sum < 30000000) return 3;
                  if (sum < 40000000) return 4;
                  return 5;
                };

                return (
                  <div
                    key={`second-${items.id}`}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="relative">
                          <img
                            src={items.photo || "/placeholder.svg"}
                            width={64}
                            height={64}
                            alt={items.Reklama_nomi}
                            className="rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {items.Reklama_nomi}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-sm">
                              {summa.toLocaleString("uz-UZ")} Som
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < getStarsBySumma(summa)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          #{index + 1} Top
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Photo Carousel */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <PlayCircleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Top Reklama Fotosuratlari
            </h2>
          </div>

          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              {statistikPhotosData && statistikPhotosData[currentSlide] && (
                <img
                  src={
                    statistikPhotosData[currentSlide].photo ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={statistikPhotosData[currentSlide].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-3xl font-bold text-white mb-2 animate-fade-in">
                  {statistikPhotosData &&
                    statistikPhotosData[currentSlide]?.name}
                </h3>
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full z-10 transition-all duration-300 hover:scale-110 shadow-lg"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Progress indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {statistikPhotosData?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Top Stations with Infinite Horizontal Scroll */}
      <div className="px-4 pb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <MapPinIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Metropolitenda eng ko'p reklamasi bor bekatlar
          </h2> 
        </div>

        <div className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
          <div
            className="animate-scroll-horizontal flex space-x-6"
            style={{ width: "max-content" }}
          >
            {/* First set of stations */}
            {StatistikData?.top_5_stations?.map((items, index) => (
              <div
                key={`first-${items.id}`}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden flex-shrink-0 w-80"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Geometric shapes */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/10 to-indigo-500/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-slate-800 truncate group-hover:text-emerald-600 transition-colors duration-300">
                        {items.position__station__name}
                      </h3>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <span className="mr-2">🎯</span>
                          {items.total} ta reklama
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <MapPinIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Progress visualization */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">
                        Performance
                      </span>
                      <span className="text-emerald-600 font-bold">
                        {Math.min(items.total * 10, 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(items.total * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {StatistikData?.top_5_stations?.map((items, index) => (
              <div
                key={`second-${items.id}`}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden flex-shrink-0 w-80"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Geometric shapes */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/10 to-indigo-500/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-slate-800 truncate group-hover:text-emerald-600 transition-colors duration-300">
                        {items.position__station__name}
                      </h3>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <span className="mr-2">🎯</span>
                          {items.total} ta reklama
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <MapPinIcon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Progress visualization */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">
                        Performance
                      </span>
                      <span className="text-emerald-600 font-bold">
                        {Math.min(items.total * 10, 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(items.total * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

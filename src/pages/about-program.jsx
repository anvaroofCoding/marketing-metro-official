import { Image } from "antd";
import {
  Users,
  Code,
  Smartphone,
  Globe,
  Star,
  Award,
  LucideLayoutDashboard,
  MapIcon,
  Building,
  Sparkles,
  Archive,
  SearchCheckIcon,
  LogIn,
} from "lucide-react";

export default function AboutProgram() {
  const developers = [
    {
      name: "Toshpo'lotov Feruz G'olib o'g'li",
      role: "Proyekt boshqaruvchi",
      avatar: "/xizmat.png",
      contribution: "Dasturning yaratilishida boshqaruv",
    },
    {
      name: "Anvarov Islomjon Toxir o'g'li",
      role: "Frontend dasturchi",
      avatar: "/Islom.JPG",
      contribution: "Frontend arxitekturasi va UI/UX",
    },
    {
      name: "Savriyev Sunnat Sobir o'g'li",
      role: "Backend Dasturchi",
      avatar: "/sunnatchik.jpg",
      contribution: "Data baza va API boshqaruvi",
    },
  ];

  const appPages = [
    {
      title: "Dashboard  ",
      description: "Bu sahifada marketining statistikasi yuritiladi",
      icon: LucideLayoutDashboard,
      image: "/dashboard.png",
      features: [
        "Shartnomalar sonini ko'rish",
        "Shartnomalarning umumiy summasi",
        "Metropolitenda reklamalar ko'p bekatlarning top-10tasini ko'rish",
      ],
    },
    {
      title: "Metropoliten xaritasi",
      description:
        "Bu sahifada Metropolitenning xaritasini batafsil ko'rib, bekatlarning oldidagi tugmalarni bosib ularning sahifalariga o'tish mumkin",
      icon: MapIcon,
      image: "/map.png",
      features: [
        "Tez va qulayligi",
        "Yaqin va uzoqlikka harakatlantirish",
        "Bekat nomlari oldidagi tugmalar orqali bekatlarning sahifasiga o'tish ",
      ],
    },
    {
      title: "Har bir bekatning o'z sahifasi",
      description:
        "Bu sahifa orqali bekatlardagi reklamalarini nazoratga olish mumkin",
      icon: Building,
      image: "stations.png",
      features: [
        "Bekat chizmasini ko'ra olish va uni o'zgartirish",
        "Bekatlarga reklama joylarini qo'shish, ularni ko'rish va reklama joylarini holatlarini ham bilish",
        "Excel formatida shu bekatdagi joylarni olish mumkin",
      ],
    },
    {
      title: "Har bir reklamaning o'z sahifasi",
      description:
        "Bu sahifa orqali har bir reklamalarning shartnomalari tuziladi",
      icon: Sparkles,
      image: "/advertimes.png",
      features: [
        "Reklama ma'lumotlar, shartnoma va reklamaning rasmlarini saqlash",
        "Reklama ma'lumotlarni tahrirlash",
        "Shartnomani tugatish",
      ],
    },
    {
      title: "Arxiv",
      description: "Bu sahifada barcha reklamalarning tarixi saqlanib qoladi",
      icon: Archive,
      image: "/archive.png",
      features: [
        "Excel va PDF ko'rinishida arxivni saqlash",
        "Barcha arvixdagi ma'lumotlarni qidirish",
        "Har bir arxivda qolgan reklama haqida ma'lumotlarni ko'rish",
      ],
    },
    {
      title: "Umumiy reklamalar",
      description: "Bu sahifada barcha reklamalarni ko'rishingiz mumkin",
      icon: SearchCheckIcon,
      image: "/archive.png",
      features: [
        "Excel va PDF ko'rinishida reklamalarni saqlash",
        "Kerakli bo'lgan reklamalarni qidiriuv ularni shunchaki Excel qilib saqlab olish",
        "Mavjud reklamalar haqida ma'lumotlarni ko'rish",
      ],
    },
    {
      title: "Shartnomalar muddati",
      description:
        "Bu sahifada muddatiga 7 kun qolgan va muddati tugagan reklamalarni ko'rish uchun",
      icon: SearchCheckIcon,
      image: "/deley.png",
      features: [
        "Excel ko'rinishida reklamalarni saqlash",
        "Reklama muddati tugagan hamkorlar haqida ma'lumot olish",
        "Barcha kechikkan reklamalarni ko'rish",
      ],
    },
    {
      title: "Kirish",
      description: "Bu sahifa dasturga kirish qismi",
      icon: LogIn,
      image: "/login.png",
      features: [
        "Judayam zamonaviy ko'rinish",
        "Dizayn olamining eng yorqin ranglari",
        "Particles animatsiya va juda ham aniqlikdagi formlar bilan ishlangan",
      ],
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section with National Elements */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl border border-slate-200/20 p-12 mb-12 mx-4 mt-4 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-blue-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-bold text-5xl text-white">
              Dastur bilan tanishuv
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Dasturning asosiy maqsadi Toshkent Metropolitenning barcha
            bekatlaridagi reklamalarni nazorat qilish va ularning shartnomalari
            saqlash
          </p>
        </div>
      </div>

      {/* Development Team Section - Apple Style */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Ishlab chiqish jamoasi
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={dev.avatar || "/placeholder.svg"}
                      alt={dev.name}
                      className="w-25 h-30 rounded-full mx-auto border-4 border-blue-100 group-hover:border-blue-300 transition-colors"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dev.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{dev.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {dev.contribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Pages Section */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Dastur sahifalari
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Har bir sahifa o'ziga xos funksiyalarga va qulay interfeysga ega
          </p>
        </div>

        <div className="space-y-12">
          {appPages.map((page, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className="">
                  <Image
                    src={page.image || "/placeholder.svg"}
                    alt={page.title}
                    className="w-full h-64 object-cover rounded-2xl hover:rounded-2xl overflow-hidden"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <page.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {page.title}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {page.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Asosiy imkoniyatlar:
                  </h4>
                  <ul className="space-y-2">
                    {page.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-7xl mx-auto px-6 mb-16 ">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">
                Asosiy zamonaviy texnologiyalar
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "React", icon: "/React.png" },
              { name: "Redux", icon: "/Redux.png" },
              { name: "Python", icon: "/Python.png" },
              { name: "PostgresSQL", icon: "/PostgresSQL.png" },
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  {/* <tech.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" /> */}
                  <img src={tech.icon} className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold text-white">{tech.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with National Pride */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl mx-4 p-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-400" />
            <p className="text-white text-lg">
              O'zbekiston bilan faxrlanib yaratildi
            </p>
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-blue-100">
            Milliy qadriyatlar va zamonaviy texnologiyalarning uyg'unligi
          </p>
        </div>
      </div> */}
    </div>
  );
}

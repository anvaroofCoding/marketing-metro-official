import { useGetReklamaQuery } from "@/services/api";
import { Image, Tag } from "antd";
import { useParams } from "react-router-dom";
import { Phone, Building2, CalendarDays, FileText, MapPin } from "lucide-react";
import ReklamaDetails from "./OneReklamaPage";

export default function Positions() {
  const { ids } = useParams();
  const { data, isLoading, error } = useGetReklamaQuery(ids);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  function formatDate(dateString) {
    if (!dateString || typeof dateString !== "string") return "Noma'lum sana";

    const [datePart, timePart] = dateString.split(" ");
    if (!datePart || !timePart) return dateString;

    const [dd, mm, yyyy] = datePart.split("-");
    const [hh, min] = timePart.split(":");

    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  }

  console.log(formatDate("14-11-2025 11:13:35"));

  console.log(data);
  return (
    <div className="w-full ">
      <div className="relative w-full bg-gradient-to-r from-[#2c6e49] to-[#1f4d36] rounded-xl p-6 shadow-lg overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 bg-[url('/naqshtitle.png')] 
          bg-repeat opacity-10 pointer-events-none"
        />

        <div className="relative z-10">
          {/* Title */}
          <h1 className="text-green-50 text-3xl font-bold leading-snug mb-4 flex items-center gap-2">
            <MapPin size={26} />
            {data?.station} bekatidagi {data?.number}-joy uchun reklama
          </h1>

          <div className="flex items-start gap-6 mt-4">
            {/* Logo */}
            <div className="w-[120px] h-[120px] rounded-xl overflow-hidden hover:rounded-full transition-all duration-300 shadow-md">
              <Image
                src={data?.advertisement?.ijarachi_logo}
                width={120}
                height={120}
                className="object-cover rounded-full"
              />
            </div>

            {/* Text information */}
            <div className="flex flex-col gap-3 text-green-50">
              {/* Ijarachi */}
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 size={22} />
                {data?.advertisement?.ijarachi_name}
              </h2>

              {/* Phone */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <Phone size={20} />
                {data?.advertisement?.ijarachi_contact}
              </p>

              {/* Reklama nomi */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <FileText size={20} />
                Reklama nomi:{" "}
                <span className="font-semibold">
                  {data?.advertisement?.Reklama_nomi}
                </span>
              </p>

              {/* Start date */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <CalendarDays size={20} />
                Boshlanish sanasi:
                <Tag color="green" className="text-base px-3 py-1 rounded-full">
                  {data?.advertisement?.Shartnoma_muddati_boshlanishi}
                </Tag>
              </p>

              {/* End date */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <CalendarDays size={20} />
                Tugash sanasi:
                <Tag color="red" className="text-base px-3 py-1 rounded-full">
                  {data?.advertisement?.Shartnoma_tugashi}
                </Tag>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ReklamaDetails data={data} />
    </div>
  );
}

import { useGetArchiveTrainsDetailQuery } from "@/services/api";
import { Image, Spin, Tag } from "antd";
import { useParams } from "react-router-dom";
import { Phone, Building2, CalendarDays, FileText, MapPin } from "lucide-react";
import Train_Archive_Paid from "./tarkib_archive_paid";
import { toast } from "sonner";

export default function Tarkib_archive_details() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetArchiveTrainsDetailQuery({ id });
  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin />
      </div>
    );
  if (error) {
    toast.error(error);
  }
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
          <div className="flex items-center justify-between">
            <h1 className="text-green-50 text-3xl font-bold leading-snug mb-4 flex items-center gap-2">
              <MapPin size={26} />
              {data?.tarkib_nomi} harakat tarkib {data?.position_number}
              -joylashgan reklama arxivi
            </h1>
          </div>

          <div className="flex items-start gap-6 mt-4">
            {/* Logo */}
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden hover:rounded-full transition-all duration-300 shadow-md">
              <Image
                src={data?.ijarachi_logo}
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
                {data?.ijarachi_name}
              </h2>

              {/* Phone */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <Phone size={20} />
                {data?.ijarachi_contact}
              </p>

              {/* Reklama nomi */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <FileText size={20} />
                Reklama nomi:{" "}
                <span className="font-semibold">{data?.Reklama_nomi}</span>
              </p>

              {/* Start date */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <CalendarDays size={20} />
                Boshlanish sanasi:
                <Tag color="green" className="text-base px-3 py-1 rounded-full">
                  {data?.Shartnoma_muddati_boshlanishi}
                </Tag>
              </p>

              {/* End date */}
              <p className="text-lg opacity-90 flex items-center gap-2">
                <CalendarDays size={20} />
                Tugash sanasi:
                <Tag color="red" className="text-base px-3 py-1 rounded-full">
                  {data?.Shartnoma_tugashi}
                </Tag>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Train_Archive_Paid data={data} />
    </div>
  );
}

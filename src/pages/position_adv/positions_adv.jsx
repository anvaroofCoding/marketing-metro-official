import { useGetTarkibAdvertimesDetailsQuery } from "@/services/api";
import { Image, Spin, Tag } from "antd";
import { useParams } from "react-router-dom";
import { Phone, Building2, CalendarDays, FileText, MapPin } from "lucide-react";
import Position_adv_one from "./position_adv_one";
import UpdateAdvertisementsTrains from "./updateAdvertimiesTrain";
import Ending_Adv_train from "./adv_ending";
export default function Position_adv() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTarkibAdvertimesDetailsQuery(id);
  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (data.tarkib_advertisement) {
    return (
      <div className="w-full ">
        <div className="relative w-full bg-gradient-to-r from-[#2c6e49] to-[#1f4d36] rounded-xl p-6 shadow-lg overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('/naqshtitle.png')]
              bg-repeat opacity-10 pointer-events-none"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-green-50 text-3xl font-bold leading-snug mb-4 flex items-center gap-2">
                <MapPin size={26} />
                {data?.harakat_tarkibi} harakat tarkibidagi {data?.position}
                -joydagi reklama
              </h1>
              <div className="flex gap-3">
                <UpdateAdvertisementsTrains
                  id={data?.tarkib_advertisement?.id}
                  defaultData={data.tarkib_advertisement}
                  position_id={id}
                />
                <Ending_Adv_train ids={data?.tarkib_advertisement?.id} />
              </div>
            </div>
            <div className="flex items-start gap-6 mt-4">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden hover:rounded-full transition-all duration-300 shadow-md">
                <Image
                  src={data?.tarkib_advertisement?.ijarachi_logo}
                  width={120}
                  height={120}
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-3 text-green-50">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 size={22} />
                  {data?.tarkib_advertisement?.ijarachi_name}
                </h2>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <Phone size={20} />
                  {data?.tarkib_advertisement?.ijarachi_contact}
                </p>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <FileText size={20} />
                  Reklama nomi:{" "}
                  <span className="font-semibold">
                    {data?.tarkib_advertisement?.Reklama_nomi}
                  </span>
                </p>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <CalendarDays size={20} />
                  Boshlanish sanasi:
                  <Tag
                    color="green"
                    className="text-base px-3 py-1 rounded-full"
                  >
                    {data?.tarkib_advertisement?.Shartnoma_muddati_boshlanishi}
                  </Tag>
                </p>
                <p className="text-lg opacity-90 flex items-center gap-2">
                  <CalendarDays size={20} />
                  Tugash sanasi:
                  <Tag color="red" className="text-base px-3 py-1 rounded-full">
                    {data?.tarkib_advertisement?.Shartnoma_tugashi}
                  </Tag>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Position_adv_one data={data} />
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center py-20 gap-1">
        <h2 className="text-2xl font-semibold text-center solid text-green-700">
          Hozircha ma’lumot yo‘q
        </h2>
      </div>
    );
  }
}

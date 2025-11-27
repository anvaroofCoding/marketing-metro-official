import {
  useGetAllReklamaDepoQuery,
  useGetPDFDashMainQuery,
} from "@/services/api";
import { Card, Spin, Select, Button } from "antd";
import { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
// import "../position_adv/dash.css";
const { Meta } = Card;
const AllReklamaDash = () => {
  const [type, setType] = useState("train");
  const { data, isLoading } = useGetAllReklamaDepoQuery({ type });
  const { data: FilePdfFilled, isFetching: isFetchingPdf } =
    useGetPDFDashMainQuery({ type });
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const list = data?.ijarachilar || [];

  function downloadPdf() {
    if (!FilePdfFilled) return;
    const url = window.URL.createObjectURL(FilePdfFilled);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ijarachilar_summasi.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("PDf muvaffaqiyatli ko'chirildi!");
  }
  return (
    <div>
      <div className="relative bg-gradient-to-r from-green-800 via-green-800 to-green-800 rounded-3xl border border-slate-200/20 p-8 mb-8 overflow-hidden flex justify-between items-center">
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
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-green-600/10 to-green-600/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10">
          <h1 className="font-bold text-4xl text-white animate-fade-in solid">
            Barcha Ijarachilarning to'lagan summalari
          </h1>
        </div>
        <div className="flex gap-5">
          <Select
            value={type}
            onChange={(v) => setType(v)}
            className="green-select"
            style={{ width: 200 }}
            options={[
              { value: "train", label: "Xarakat tarkibi" },
              { value: "station", label: "Bekatar" },
            ]}
          />

          <Button
            variant="solid"
            color="green"
            icon={<DownloadOutlined />}
            onClick={downloadPdf}
            loading={isFetchingPdf}
          >
            PDF yuklab olish
          </Button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {list.map((item, index) => (
          <Card
            key={index}
            hoverable
            className="shadow-md rounded-lg"
            cover={
              <img
                src={item.logo}
                alt={item.ijarachi}
                className="h-40 w-full object-contain p-4 bg-white"
              />
            }
          >
            <Meta
              title={item.ijarachi}
              description={
                <div className="mt-2 text-sm">
                  <p>
                    <b>Jami summa:</b>{" "}
                    {item.jami_summa?.toLocaleString("uz-UZ")} so‘m
                  </p>
                  <p>
                    <b>{type == "train" ? "Tarkiblar" : "Bekatlar"} soni:</b>{" "}
                    {item.tarkiblar?.length}
                    {type == "train"
                      ? item.tarkiblar?.length
                      : item.bekatlar?.length}
                  </p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllReklamaDash;

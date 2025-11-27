import {
  useGetAllAdvertimestQuery,
  useGetPDFallReklamaMainQuery,
} from "@/services/api";
import { DownloadOutlined } from "@ant-design/icons";
import { Card, Button, Spin, Typography } from "antd";
import { Eye, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function DashLiniya() {
  const { data: GetAllAdvertimest, isLoading } = useGetAllAdvertimestQuery();
  const { data: FilePdfFilled, isFetching: isFetchingPdf } =
    useGetPDFallReklamaMainQuery();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const list = GetAllAdvertimest?.liniyalar ?? [];
  function downloadPdf() {
    if (!FilePdfFilled) return;
    const url = window.URL.createObjectURL(FilePdfFilled);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar-statistikasi.pdf");
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
            Metropoliten Liniyalari
          </h1>
        </div>
        <Button
          variant="solid"
          color="green"
          icon={<DownloadOutlined />}
          onClick={downloadPdf}
          isLoading={isFetchingPdf}
        >
          PDF yuklab olish
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => {
          const reklama = item?.umumiy_reklama_soni ?? 0;
          const liniya = encodeURIComponent(item?.liniya ?? "noma'lum");
          return (
            <Card
              key={item?.liniya ?? Math.random()}
              className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-250 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(5, 78, 52, 0.06)", // subtle bg for icon
                    }}
                  >
                    <Map size={22} className="text-green-900" />
                  </div>

                  <Typography.Title level={5} className="m-0">
                    {item?.liniya ?? "—"}
                  </Typography.Title>
                </div>
                <div
                  className="flex items-center justify-center px-4 py-1.5 rounded-full shadow"
                  style={{
                    background: "#064e3b",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 13,
                    minWidth: 64,
                    textAlign: "center",
                    boxShadow: "0 6px 18px rgba(4, 78, 63, 0.12)",
                  }}
                  aria-label={`Reklama soni: ${reklama}`}
                >
                  {reklama} ta
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() =>
                    navigate(`/All/advertisement/liniya/${liniya}`)
                  }
                  className="flex items-center gap-2 rounded-xl h-9 px-4"
                  style={{
                    background: "#064e3b",
                    color: "white",
                    border: "none",
                    boxShadow: "0 6px 18px rgba(4, 78, 63, 0.12)",
                  }}
                  aria-label={`Ko'rish: ${item?.liniya}`}
                >
                  <Eye size={16} />
                  Ko‘rish
                </Button>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full text-center py-8 text-neutral-500">
            Liniyalar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}

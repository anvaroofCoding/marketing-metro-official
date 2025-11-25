import { useState, useMemo } from "react";
import { useGetAllAdvertimestQuery } from "@/services/api";
import { Table, Input, Button, Spin, Image, Space, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Search, PlusCircle } from "lucide-react";
import { EyeOutlined } from "@ant-design/icons";
export default function Dash_Reklama() {
  const navigate = useNavigate();
  const { data: GetAllAdvertimest, isLoading } = useGetAllAdvertimestQuery();
  const { liniya, bekat, turi } = useParams();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // Load More default 5 ta
  const list_liniya = GetAllAdvertimest?.liniyalar?.find(
    (item) => item.liniya === liniya
  );
  const list_bekat = list_liniya?.bekatlar?.find(
    (item) => item.bekat === bekat
  );
  const list_turi = list_bekat?.qurilma_turlari?.find(
    (item) => item.turi === turi
  );
  const reklamalar = list_turi?.reklamalar;
  const filteredData = useMemo(() => {
    return reklamalar?.filter((item) => {
      const term = search?.toLowerCase();
      return (
        item.Reklama_nomi.toLowerCase().includes(term) ||
        item.ijarachi_name?.toLowerCase().includes(term) ||
        item.Shartnoma_raqami?.toLowerCase().includes(term)
      );
    });
  }, [search, reklamalar]);

  const visibleData = filteredData?.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const columns = [
    {
      title: "Rasm",
      dataIndex: "photo",
      key: "photo",
      render: (url) => (
        <Image
          src={url}
          alt="photo"
          width={60}
          height={60}
          className="rounded-xl object-cover"
        />
      ),
    },
    {
      title: "Reklama nomi",
      dataIndex: "Reklama_nomi",
      key: "Reklama_nomi",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Ijarachi",
      key: "ijarachi_name",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Image
            src={row.ijarachi_logo}
            width={30}
            height={30}
            className="rounded-full"
            alt="logo"
          />
          <span>{row.ijarachi_name}</span>
        </div>
      ),
    },
    {
      title: "Shartnoma raqami",
      dataIndex: "Shartnoma_raqami",
      key: "Shartnoma_raqami",
    },
    {
      title: "Muddati",
      key: "muddati",
      render: (_, row) => (
        <div>
          <div>Boshi: {row.Shartnoma_muddati_boshlanishi}</div>
          <div>Tugashi: {row.Shartnoma_tugashi}</div>
        </div>
      ),
    },
    {
      title: "Qurilma narxi",
      dataIndex: "Qurilma_narxi",
      key: "Qurilma_narxi",
      render: (val) => val + " so‘m",
    },
    {
      title: "To'langan summasi",
      dataIndex: "Shartnoma_summasi",
      key: "Shartnoma_summasi",
      render: (val) => val + " so‘m",
    },
    {
      title: "Yaratuvchi",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Yaratilgan vaqt",
      dataIndex: "created_at",
      key: "created_at",
    },

    {
      title: "Batafsil",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Batafsil ko'rish">
            <Button
              type="primary"
              size="small"
              style={{ background: "#064e3b", borderColor: "#064e3b" }}
              onClick={() => navigate(`/All/advertisement/${record.id}`)}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <div className="relative bg-gradient-to-r from-green-800 via-green-800 to-green-800 rounded-3xl border border-slate-200/20 p-8 mb-8 overflow-hidden">
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
            {liniya} → {bekat} → {turi}
          </h1>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Qidirish... (nomi, ijarachi, shartnoma)"
            className="pl-10 py-2 rounded-xl"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <Table
        dataSource={visibleData}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="shadow-md rounded-2xl overflow-hidden"
      />

      {/* LOAD MORE */}
      {visibleCount < filteredData?.length && (
        <div className="flex justify-center mt-6">
          <Button
            icon={<PlusCircle size={18} />}
            onClick={() => setVisibleCount(visibleCount + 5)}
            className="h-10 px-6 rounded-xl flex items-center gap-2"
            style={{
              background: "#064e3b",
              color: "white",
              border: "none",
            }}
          >
            Yana yuklash
          </Button>
        </div>
      )}

      {/* NOTHING FOUND */}
      {filteredData?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Hech narsa topilmadi.
        </div>
      )}
    </div>
  );
}

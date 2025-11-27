// import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Select,
  // Select,
  Spin,
  Table,
} from "antd";
import { useState } from "react";
import { Eye, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetAllAdvTrainQuery,
  useGetIjarachiOptionQuery,
  useGetPositionTrainOptionQuery,
  useGetTarkibTrainOptionQuery,
} from "@/services/api";
import { SearchOutlined } from "@ant-design/icons";

export default function AllAdvTrain() {
  const navigate = useNavigate();

  // PAGINATION
  const [page, setPage] = useState(1);

  // FILTERS
  const [value, setValue] = useState("");
  const [selectedIjarachi, setSelectedIjarachi] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedTarkib, setSelectedTarkib] = useState("");

  // EDIT MODAL

  // API
  const { data, isLoading } = useGetAllAdvTrainQuery({
    limit: 30,
    search: value,
    page,
    Ijarachi: selectedIjarachi,
    position: selectedPosition,
    position__harakat_tarkibi: selectedTarkib,
  });

  const { data: ijarachilar, isLoading: ijarachi_loads } =
    useGetIjarachiOptionQuery();
  const { data: positionsList, isLoading: position_loads } =
    useGetPositionTrainOptionQuery();
  const { data: tarkibList, isLoading: tarkib_loads } =
    useGetTarkibTrainOptionQuery();

  // TABLE COLUMNS
  const columns = [
    {
      title: "№",
      key: "index",
      render: (_, __, index) => <b>{(page - 1) * 20 + (index + 1)}</b>,
    },
    {
      title: "Depo nomi",
      dataIndex: "depo_nomi",
      render: (v) => <b>{v}</b>,
    },
    {
      title: "Joy raqami",
      dataIndex: "position",
      render: (v) => <b>{v}</b>,
    },
    {
      title: "Harakat tarkibi",
      dataIndex: "tarkib_nomi",
      render: (v) => v || "-",
    },
    {
      title: "Ijarachi",
      render: (_, r) =>
        r?.ijarachi_name ? (
          r?.ijarachi_name
        ) : (
          <span className="text-red-600">Bo‘sh joy</span>
        ),
    },
    {
      title: "Ijarachi raqami",
      render: (_, r) =>
        r?.ijarachi_contact || <span className="text-red-600">-</span>,
    },
    {
      title: "Yaratgan",
      render: (_, r) =>
        r?.created_by || <span className="text-red-600">-</span>,
    },
    {
      title: "Yaratilgan sana",
      render: (_, r) =>
        r?.created_at || <span className="text-red-600">-</span>,
    },
    {
      title: "Jami to'lovlar",
      render: (_, r) =>
        r?.Shartnoma_summasi + " " + "so'm" || (
          <span className="text-red-600">-</span>
        ),
    },
    {
      title: "Shartnoma tugash sanasi",
      render: (_, r) =>
        r?.Shartnoma_tugashi || <span className="text-red-600">-</span>,
    },
    // ACTIONS
    {
      title: "Amallar",
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: "view",
            label: (
              <span className="flex items-center gap-2 text-green-800">
                <Eye size={14} />
                Ko'rish
              </span>
            ),
            onClick: () => {
              navigate(`/train/adver/${record.position}`);
            },
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MoreVertical size={18} />} />
          </Dropdown>
        );
      },
    },
  ];

  if (isLoading || ijarachi_loads || position_loads || tarkib_loads)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-green-800 solid">
        Barcha poyezdlarning hozirda mavjud reklamalari
      </h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          allowClear
        />

        <Select
          placeholder="Ijarachi"
          allowClear
          showSearch
          options={ijarachilar?.results?.map((i) => ({
            label: i.name,
            value: i.id,
          }))}
          onChange={setSelectedIjarachi}
        />

        <Select
          placeholder="Joy raqami"
          allowClear
          showSearch
          options={positionsList?.results?.map((i) => ({
            label: i.position + "-joy" + " " + i.harakat_tarkibi,
            value: i.id,
          }))}
          onChange={setSelectedPosition}
        />

        <Select
          placeholder="Harakat tarkibi"
          allowClear
          showSearch
          options={tarkibList?.results.map((i) => ({
            label: i.tarkib,
            value: i.id,
          }))}
          onChange={setSelectedTarkib}
        />
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={data?.results}
        rowKey="id"
        pagination={{
          current: page,
          total: data?.count,
          pageSize: 30,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}

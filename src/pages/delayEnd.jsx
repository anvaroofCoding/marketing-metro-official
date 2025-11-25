import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Spin, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTimeQuery, useGetTugaganExcelQuery } from "../services/api";
import { toast, Toaster } from "sonner";
export default function DelayEnd() {
  const { Column, ColumnGroup } = Table;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const { data: excelBlob, isFetching } = useGetTugaganExcelQuery();
  const {
    data,
    isLoading: Endloading,
    error: EndError,
  } = useGetTimeQuery({ page, limit, search });
  if (Endloading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  if (EndError) {
    toast.error("Ma'lumotlarni yuklashda xatolik");
  }
  function handleShow(ida) {
    navigate(`/kechikishlar/${ida}`);
  }
  function handleDownloads() {
    if (!excelBlob) return;
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vaqti-tugaganlar.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Excel muvaffaqiyatli ko'chirildi");
  }
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-2">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[250px]"
        />
        <Button
          color="green"
          variant="solid"
          icon={<FileExcelOutlined />}
          onClick={handleDownloads}
          loading={isFetching}
          disabled={!excelBlob}
          className="w-full sm:w-auto"
        >
          Excel ko'chirish
        </Button>
      </div>
      <div className="flex-1 w-full overflow-x-auto">
        <Table
          dataSource={data?.results?.tugagan}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.count,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: "max-content" }}
        >
          <ColumnGroup>
            <Column title="ID" dataIndex="id" key="id" responsive={["sm"]} />
            <Column
              title="Ijarachi"
              dataIndex="ijarachi_name"
              key="ijarachi_name"
            />
            <Column
              title="Reklama nomi"
              dataIndex="Reklama_nomi"
              key="Reklama_nomi"
            />
            <Column
              title="Shartnoma raqami"
              dataIndex="Shartnoma_raqami"
              key="Shartnoma_raqami"
              responsive={["md"]}
            />
            <Column title="Bekat nomi" dataIndex="station" key="station" />
            <Column
              title="Shartnoma boshlanishi"
              dataIndex="Shartnoma_muddati_boshlanishi"
              key="Shartnoma_muddati_boshlanishi"
              responsive={["lg"]}
            />
            <Column
              title="Shartnoma tugashi"
              dataIndex="Shartnoma_tugashi"
              key="Shartnoma_tugashi"
              responsive={["lg"]}
              className="text-[#e03131ff] font-semibold"
              onCell={() => ({
                style: {
                  backgroundColor: "#e03131ff",
                  textAlign: "center",
                },
              })}
            />
            <Column
              title="Telefon raqami"
              dataIndex="ijarachi_contact"
              key="ijarachi_contact"
              responsive={["md"]}
            />
            <Column title="Saqlandi" dataIndex="created_at" key="created_at" />
            <Column
              title="Tasdiqlovchi"
              dataIndex="created_by"
              key="created_by"
              responsive={["md"]}
            />
            <Column
              title="Batafsil"
              key="id"
              render={(_, record) => (
                <Space size="middle">
                  <Tooltip title="Batafsil ko'rish">
                    <Button
                      variant="solid"
                      color="green"
                      size="small"
                      onClick={() => handleShow(record.id)}
                    >
                      <EyeOutlined />
                    </Button>
                  </Tooltip>
                </Space>
              )}
            />
          </ColumnGroup>
        </Table>
      </div>
    </div>
  );
}

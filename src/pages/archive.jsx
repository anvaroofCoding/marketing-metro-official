import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Spin, Table, Tooltip } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetArchivePdfQuery,
  useGetArchiveQuery,
  useGetArchiveShowExcelQuery,
} from "../services/api";
import { toast, Toaster } from "sonner";
export default function Archive() {
  const { Column, ColumnGroup } = Table;
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: excelBlob, isFetching } = useGetArchiveShowExcelQuery();
  const { data: FilePdfFilled, isFetching: isFetchingPdf } =
    useGetArchivePdfQuery();
  const {
    data,
    isLoading: archiveloading,
    error: archiveerror,
  } = useGetArchiveQuery({ page, limit, search });
  if (archiveloading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  if (archiveerror) {
    toast.error(
      "Biron bir xatolik chiqib qolgan ko'rinadi! Balki internetni tekshirib olarsiz?"
    );
  }
  function handleShow({ id, ids, arxiver }) {
    navigate(`station/${id}/position/${ids}/${arxiver}`);
  }
  function handleDownloads() {
    if (!excelBlob) return;
    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reklamalar-arxiv.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Excel muvaffaqiyatli ko'chirildi!");
  }
  function handleDownloadsPdf() {
    if (!FilePdfFilled) return;
    const url = window.URL.createObjectURL(FilePdfFilled);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "arxiv.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("PDf muvaffaqiyatli ko'chirildi!");
  }
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-2">
        <Input
          placeholder="Reklama nomi bo'yicha qidiring..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[250px]"
        />
        <Button
          variant="solid"
          color="orange"
          icon={<FileExcelOutlined />}
          onClick={handleDownloadsPdf}
          loading={isFetchingPdf}
          disabled={!FilePdfFilled}
          className="w-full sm:w-auto"
        >
          PDF ko'chirish
        </Button>
        <Button
          variant="solid"
          color="green"
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
          dataSource={data?.results}
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
            <Column title="Ijarachi" dataIndex="Ijarachi" key="Ijarachi" />
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
            <Column
              title="Bekat nomi"
              dataIndex="station_name"
              key="station_name"
            />
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
            />
            <Column
              title="Telefon raqami"
              dataIndex="ijarachi_contact"
              key="contact_number"
              responsive={["md"]}
            />
            <Column
              title="Saqlandi"
              dataIndex="created_at"
              key="created_at"
              render={(created_at) => {
                const now = new Date();
                const givenDate = new Date(created_at);
                const diffDays = Math.floor(
                  (now - givenDate) / (1000 * 60 * 60 * 24)
                );
                if (diffDays === 0) return "Bugun";
                if (diffDays === 1) return "Kecha";
                return `${diffDays} kun oldin`;
              }}
            />
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
                      onClick={() =>
                        handleShow({
                          id: record?.station,
                          ids: record?.position,
                          arxiver: record.id,
                        })
                      }
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

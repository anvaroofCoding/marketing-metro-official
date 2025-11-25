import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Upload,
  Skeleton,
} from "antd";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreatePositionMutation,
  useDeletePositionMutation,
  useGetPositionsByStationQuery,
  useGetStationQuery,
  usePostPdfMutation,
  useUpdatePositionMutation,
} from "../services/api";
import { toast, Toaster } from "sonner";
const { Column, ColumnGroup } = Table;
export default function StationDetail() {
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [inputValue, setInputValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: station,
    isLoading: stationLoading,
    error: stationError,
  } = useGetStationQuery(id);
  const {
    data: positions,
    isLoading: positionsLoading,
    error: positionsError,
    refetch,
  } = useGetPositionsByStationQuery({
    stationId: id,
    page: currentPage,
    limit: pageSize,
    search: value,
  });
  const [createPosition, { isLoading: createLoading, error: createError }] =
    useCreatePositionMutation();
  const [deletePosition, { isLoading: deleteLoading }] =
    useDeletePositionMutation();
  const [updatePosition, { isLoading: updateLoading }] =
    useUpdatePositionMutation();
  const [postPdf] = usePostPdfMutation();
  if (createError) {
    toast.warning("Bunday positsiya mavjud, boshqa raqam qo'ying");
  }
  if (stationError || positionsError) {
    toast.error("Sahifani yangilang");
  }
  const handleDelete = async (ids) => {
    try {
      await deletePosition(ids).unwrap();
      if (positions?.results?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      toast.success("Positsiya muvaffaqiyatli o'chirildi!");
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi!");
    }
  };
  const handleOk = async () => {
    try {
      await createPosition({ station_id: id, number: inputValue }).unwrap();
      setIsModalOpen(false);
      setInputValue("");
      toast.success("Positsiya muvaffaqiyatli qo'shildi!");
    } catch (err) {
      toast.error(err.toString());
    }
  };
  const handleUpdate = async () => {
    try {
      await updatePosition({ id: editingId, number: inputValue }).unwrap();
      toast.success("Positsiya muvaffaqiyatli tahrirlandi");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Tahrirlashda xatolik yuz berdi!");
    }
  };
  const handleChange = async (info) => {
    const file = info.file;
    if (!file) return;
    try {
      await postPdf({ id, file }).unwrap();
      toast.success("PDF muvaffaqiyatli yangilandi!");
      refetch();
    } catch (err) {
      toast.error("PDF yangilashda xatolik yuz berdi!");
    }
  };
  if (stationLoading) {
    return (
      <div className="w-full h-full p-2 flex flex-col gap-3">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="font-[800] text-2xl lg:text-3xl text-green-600 solid">
          {station?.name} bekati reklama joylari
        </h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Link to={station?.schema_image} target="_blank">
            <Button
              variant="solid"
              color="green"
              icon={<EyeOutlined />}
              size="middle"
            >
              {station?.name} bekati xatitasi
            </Button>
          </Link>
          <Upload
            accept=".pdf"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
          >
            <Button
              variant="solid"
              color="orange"
              icon={<UploadOutlined />}
              size="middle"
            >
              PDF yangilash
            </Button>
          </Upload>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center sm:justify-between">
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 sm:flex-initial sm:w-64"
        />
        <Button
          variant="solid"
          color="green"
          onClick={() => setIsModalOpen(true)}
          icon={<PlusOutlined />}
          block
          sm={{ block: false }}
        >
          Joy qo'shish
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {positionsLoading ? (
          <Table
            dataSource={Array.from({ length: pageSize })}
            rowKey={(_, i) => i}
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize,
              total: pageSize * 2,
              disabled: true,
            }}
            className="custom-transparent-table"
            loading
          >
            <ColumnGroup>
              <Column title="Raqami" dataIndex="number" />
              <Column title="Bekat" dataIndex="station" />
              <Column title="Saqlangan vaqti" dataIndex="created_at" />
              <Column title="Ijarachi" dataIndex="created_by" />
              <Column title="Status" dataIndex="status" />
              <Column title="Amallar" dataIndex="action" />
            </ColumnGroup>
          </Table>
        ) : (
          <Table
            dataSource={positions?.results}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              current: currentPage,
              pageSize,
              total: positions?.count || 0,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            className="custom-transparent-table"
          >
            <ColumnGroup>
              <Column
                title="Raqami"
                dataIndex="number"
                width={80}
                key="number"
              />
              <Column
                title="Bekat"
                dataIndex="station"
                width={100}
                key="station"
              />
              <Column
                title="Saqlangan vaqti"
                dataIndex="created_at"
                width={130}
                key="created_at"
                render={(created_at) => {
                  const now = new Date();
                  const givenDate = new Date(created_at);
                  const diffDays = Math.floor(
                    (now - givenDate) / (1000 * 60 * 60 * 24)
                  );
                  const day = givenDate.getDate().toString().padStart(2, "0");
                  const month = (givenDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const year = givenDate.getFullYear();

                  if (diffDays === 0) return `Bugun (${day}.${month}.${year})`;
                  if (diffDays === 1) return `Kecha (${day}.${month}.${year})`;
                  return `${day}.${month}.${year}`;
                }}
              />
              <Column
                title="Yaratuvchi"
                dataIndex="created_by"
                width={100}
                key="created_by"
              />
              <Column
                title="Ijarachi"
                width={100}
                key="created_by"
                render={(_, record) => {
                  return (
                    <span>{record.advertisement?.ijarachi_name || "-"}</span>
                  );
                }}
              />

              <Column
                title="Status"
                width={80}
                key="status"
                render={(_, record) => (
                  <Button
                    type="primary"
                    size="small"
                    style={{
                      backgroundColor: record.status ? "#ef4444" : "#22c55e",
                      borderColor: record.status ? "#ef4444" : "#22c55e",
                    }}
                  >
                    {record.status ? "Band" : "Bo'sh"}
                  </Button>
                )}
              />
              <Column
                title="Amallar"
                width={140}
                key="action"
                render={(_, record) => (
                  <Space size="small" wrap>
                    {record.advertisement ? (
                      <Tooltip title="Reklamani ko'rish" color="blue">
                        <Button
                          type="primary"
                          size="small"
                          icon={<EyeFilled />}
                          onClick={() => navigate(`position/${record.id}`)}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Reklama qo'shish" color="green">
                        <Button
                          type="primary"
                          size="small"
                          icon={<AppstoreAddOutlined />}
                          onClick={() => navigate(`position/${record.id}`)}
                          style={{
                            background: "#22c55e",
                            borderColor: "#22c55e",
                          }}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Tahrirlash" color="orange">
                      <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        style={{
                          background: "#f97316",
                          borderColor: "#f97316",
                        }}
                        onClick={() => {
                          setInputValue(record.number);
                          setEditingId(record.id);
                          setIsEditModalOpen(true);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="O'chirish" color="red">
                      <Popconfirm
                        title="O'chirishni tasdiqlaysizmi?"
                        okText="Ha"
                        okType="danger"
                        cancelText="Yo'q"
                        onConfirm={() => handleDelete(record.id)}
                      >
                        <Button
                          danger
                          type="primary"
                          size="small"
                          icon={<DeleteOutlined />}
                          loading={deleteLoading}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                )}
              />
            </ColumnGroup>
          </Table>
        )}
      </div>

      <Modal
        title="Yangi Position qo'shish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createLoading}
        okText={createLoading ? "Qo'shilmoqda..." : "Qo'shish"}
        cancelText="Bekor qilish"
        centered
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Position raqamini kiriting"
          type="number"
        />
      </Modal>

      <Modal
        title="Pozitsiyani tahrirlash"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={updateLoading}
        okText={createLoading ? "Tahrirlanmoqda..." : "Tahrirlash"}
        cancelText="Bekor qilish"
        centered
      >
        <Input
          placeholder="Number kiriting"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
        />
      </Modal>
    </div>
  );
}

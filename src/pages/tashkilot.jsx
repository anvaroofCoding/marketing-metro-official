"use client";

import {
  CloudDownloadOutlined,
  PlusCircleFilled,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Pagination, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetTashkilodQuery,
  useUpdateTashkilodMutation,
  useGetTashkilodExcelQuery,
  useGetTashkilodPdfQuery,
} from "../services/api";
import { Edit2, Eye } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "@/services/modalSplice";
import PostTashkilot from "@/components/postTashkilot";
import { toast } from "sonner";

export default function Tashkilot() {
  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateTashkilodMutation();
  const [file, setFile] = useState(null);
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 24;
  const { data: positions, isLoading: positionsLoading } = useGetTashkilodQuery(
    {
      search: value,
      page,
      limit,
    }
  );
  const { data: excelBlob, isFetching } = useGetTashkilodExcelQuery();
  const { data: pdfBlob, isFetching: isFetchingPdf } =
    useGetTashkilodPdfQuery();
  const handleEditSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("contact_number", values.contact_number);
    if (file) formData.append("logo", file, file.name);
    try {
      await updateTashkilod({ id: editingId, formData }).unwrap();
      toast.success("Ma'lumot muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring" + " " + err?.message
      );
    }
  };
  const downloadFile = (blob, filename) => {
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Fayl muvaffaqiyatli ko'chirildi");
  };
  const handleUpload = (fileObj) => {
    const url = URL.createObjectURL(fileObj);
    setPreview(url);
    setFile(fileObj);
    return false;
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  if (positionsLoading || isFetching || isFetchingPdf) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  console.log(positions);
  return (
    <div className="w-full min-h-screen ">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Tashkilodlarni ro'yxatga olish
          </h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="middle"
              variant="outlined"
              className="md:flex-1 bg-transparent"
            />
            <Button
              onClick={() => downloadFile(excelBlob, "Tashkilotlar.xlsx")}
              loading={isFetching}
              icon={<CloudDownloadOutlined />}
              size="middle"
              color="green"
              variant="solid"
            >
              Excel
            </Button>
            <Button
              onClick={() => downloadFile(pdfBlob, "Tashkilotlar.pdf")}
              loading={isFetchingPdf}
              icon={<CloudDownloadOutlined />}
              size="middle"
              color="orange"
              variant="solid"
            >
              PDF
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => dispatch(openModal())}
              size="middle"
            >
              Qo'shish
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {positions?.results?.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="mb-4 flex justify-start items-center gap-4">
                <div>
                  <img
                    src={record.logo || "/placeholder.svg"}
                    alt={record.name}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {record.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {record.contact_number || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  block
                  onClick={() =>
                    navigate(
                      record.advertisement
                        ? `/${record.id}`
                        : `/tashkilotni-royxatga-olish/${record.id}`
                    )
                  }
                  icon={<Eye size={14} />}
                >
                  Ko'rish
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setEditingId(record.id);
                    form.setFieldsValue({
                      name: record.name,
                      contact_number: record.contact_number,
                    });
                    if (record.logo) setPreview(record.logo);
                    setOpen(true);
                  }}
                  variant="solid"
                  color="orange"
                  icon={<Edit2 size={14} />}
                />
              </div>
            </div>
          ))}
        </div>

        {positions?.results && (
          <div className="flex justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={positions.count}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}
        {positions?.results?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Hech qanday tashkilot topilmadi
            </p>
            <Button
              type="primary"
              onClick={() => dispatch(openModal())}
              size="large"
            >
              Yangi tashkilot qo'shish
            </Button>
          </div>
        )}
      </div>

      <Modal
        centered
        title="Tashkilotni tahrirlash"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setFile(null);
          setPreview(null);
        }}
        okText="Tahrirlashni saqlash"
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="Nomi"
            rules={[{ required: true, message: "Nomi kerak!" }]}
          >
            <Input placeholder="Tashkilot nomi" />
          </Form.Item>

          <Form.Item
            name="contact_number"
            label="Telefon"
            rules={[{ required: true, message: "Telefon kerak!" }]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          <Form.Item label="Logo">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Yuklash</Button>
            </Upload>
            {preview && (
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                style={{ marginTop: 10, width: 80, borderRadius: 8 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>

      <PostTashkilot />
    </div>
  );
}

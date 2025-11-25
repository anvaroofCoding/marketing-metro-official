import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  useGetTashkilodPdfQuery,
  useGetBannerQuery,
  useUpdateBannerMutation,
} from "../services/api";
import { Edit2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "@/services/modalSplice";
import { toast } from "sonner";
import BannerPost from "@/components/postBanner";
export default function Banner() {
  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateBannerMutation();
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 24;
  const { data: positions, isLoading: positionsLoading } = useGetBannerQuery({
    search: value,
    page,
    limit,
  });
  const handleEditSubmit = async (values) => {
    const formData = new FormData();
    formData.append("qurilmaturi", values.qurilmaturi);
    try {
      await updateTashkilod({ id: editingId, formData }).unwrap();
      toast.success("Ma'lumot muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.resetFields();
      setPreview(null);
    } catch (err) {
      toast.error(
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring" + " " + err?.message
      );
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  if (positionsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen ">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 solid">
            Bannerlarni ro'yhatga olish
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
              variant="solid"
              color="green"
              icon={<PlusOutlined />}
              onClick={() => dispatch(openModal())}
              size="middle"
            >
              Qo'shish
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          {positions?.results?.map((record, index) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              {/* Card Header: Number + Device */}
              <p className="text-xs font-semibold text-gray-500 mb-2">
                № {index + 1}
              </p>

              {/* Card Body: Device info */}
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {record.qurilmaturi}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2">
                {record.name}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {record.contact_number}
              </p>

              {/* Actions */}
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  size="small"
                  onClick={() => {
                    setEditingId(record.id);
                    form.setFieldsValue({
                      qurilmaturi: record.qurilmaturi,
                    });
                    setOpen(true);
                  }}
                  variant="solid"
                  color="orange"
                  icon={<Edit2 size={14} />}
                ></Button>
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
        title="Bannerni tahrirlash"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setPreview(null);
        }}
        okText={isLoading ? "Yuklanmoqda..." : "Saqlash"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="qurilmaturi"
            label="Banner Nomini kiriting"
            rules={[{ required: true, message: "Nomi kerak!" }]}
          >
            <Input placeholder="Banner nomi" />
          </Form.Item>
        </Form>
      </Modal>

      <BannerPost />
    </div>
  );
}

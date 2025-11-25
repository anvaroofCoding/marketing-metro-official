import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "@/services/modalSplice";
import { toast } from "sonner";
import { useGetDepoQuery, useUpdateDepoMutation } from "@/services/api";
import PostDepo from "@/components/postDepo";
export default function Depo() {
  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateDepoMutation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data: depo, isLoading: positionsLoading } = useGetDepoQuery();

  const handleEditSubmit = async (values) => {
    try {
      const formData = { nomi: values.name };
      await updateTashkilod({ id: editingId, formData }).unwrap();
      toast.success("Ma'lumot muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.resetFields();
    } catch (err) {
      toast.error(
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring" + " " + err?.message
      );
    }
  };

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
        <div className="mb-8 flex justify-between">
          <h1 className="text-3xl font-bold text-green-800 mb-6 solid">
            Deponi ro'yhatga olish
          </h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {depo?.results?.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-start items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl mb-2 line-clamp-2">
                    {record.nomi}
                  </h3>
                </div>
              </div>
              <Button
                size="small"
                onClick={() => {
                  setEditingId(record.id);
                  form.setFieldsValue({
                    name: record.nomi,
                  });
                  setOpen(true);
                }}
                variant="solid"
                color="orange"
                icon={<Edit2 size={14} />}
              />
            </div>
          ))}
        </div>

        {depo?.results?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Hech qanday tashkilot topilmadi
            </p>
            <Button
              type="primary"
              onClick={() => dispatch(openModal())}
              size="large"
            >
              Yangi ma'lumot qo'shish
            </Button>
          </div>
        )}
      </div>

      <Modal
        centered
        title="Depo nomini tahrirlash"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText={isLoading ? "Saqlanmoqda..." : "Saqlash"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="Depo nomi"
            rules={[{ required: true, message: "Nomi kerak!" }]}
          >
            <Input placeholder="Depo nomi" />
          </Form.Item>
        </Form>
      </Modal>

      <PostDepo />
    </div>
  );
}

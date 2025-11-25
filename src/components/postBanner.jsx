import { useAddBannerMutation } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";

export default function BannerPost() {
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const [form] = Form.useForm();
  const [addTashkilod, { isLoading, isError, error }] = useAddBannerMutation();
  const PostValues = async (value) => {
    const formData = new FormData();
    formData.append("qurilmaturi", value.qurilmaturi);
    await addTashkilod(formData).unwrap();
    form.resetFields();
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    dispatch(closeModal());
    toast.success("Banner nomi muvaffaqiyatli qo'shildi");
  };
  useEffect(() => {
    if (error?.data?.name) {
      toast.warning("Bunday banner nomi mavjud!");
    }
  }, [isError, error]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <Modal
        centered
        title="Banner nomini qo'shish"
        open={isOpen}
        onCancel={() => {
          dispatch(closeModal());
          form.resetFields();
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
        }}
        onOk={() => form.submit()}
        okText="Bannerni saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading }}
      >
        <Form form={form} layout="vertical" onFinish={PostValues}>
          <Form.Item
            label="Banner nomi"
            name="qurilmaturi"
            rules={[{ required: true, message: "Banner nomini kiriting!" }]}
          >
            <Input placeholder="Banner nomini yozing" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

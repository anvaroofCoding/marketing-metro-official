import { useAddTashkilodMutation } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";

export default function PostTashkilot() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const [form] = Form.useForm();
  const [addTashkilod, { isLoading, isError, error }] =
    useAddTashkilodMutation();
  const PostValues = async (value) => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("contact_number", value.contact_number);
    if (file) {
      formData.append("logo", file, file.name); // <-- MUHIM: file obyektini yuboramiz
    }
    await addTashkilod(formData).unwrap();
    form.resetFields();
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(null);
    dispatch(closeModal());
    toast.success("Ijarachi muvaffaqiyatli qo'shildi");
  };
  useEffect(() => {
    if (error?.data?.name) {
      toast.warning("Bunday Ijarachi mavjud!");
    }
  }, [isError, error]);
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

  return (
    <div>
      <Toaster position="bottom-center" richColors />
      <Modal
        centered
        title="Ijarachi qo'shish"
        open={isOpen}
        onCancel={() => {
          dispatch(closeModal());
          form.resetFields();
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
          setFile(null);
        }}
        onOk={() => form.submit()}
        okText="Ijarchini saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading }}
      >
        <Form form={form} layout="vertical" onFinish={PostValues}>
          <Form.Item
            label="Ijarachi nomi"
            name="name"
            rules={[{ required: true, message: "Ijarachi nomini kiriting!" }]}
          >
            <Input placeholder="Ijarachi nomini yozing" />
          </Form.Item>

          <Form.Item
            label="Telefon raqami"
            name="contact_number"
            rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          {/* NOTE: formItem-da name="logo" bermadim — file-ni alohida state bilan boshqaramiz */}
          <Form.Item label="Ijarchi Logosi">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Logoni yuklash</Button>
            </Upload>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ marginTop: 10, width: 80, borderRadius: 8 }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

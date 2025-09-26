import { useAddTashkilodMutation } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Upload } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PostTashkilot() {
  notification.config({ placement: "top", duration: 3 });
  const [file, setFile] = useState(null); // <-- ASL fayl obyekt
  const [preview, setPreview] = useState(null); // <-- preview URL
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const [form] = Form.useForm();

  //   add ???????????
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
    notification.success({ message: "Ijarachi muvaffaqiyatli qo'shildi" });
  };
  useEffect(() => {
    if (error?.data?.name) {
      notification.error({
        message: "Bunday Ijarachi mavjud!",
        description: "Afsus 2 marta qo'sha olmaysiz",
      });
    }
  }, [isError, error]);
  const handleUpload = (fileObj) => {
    // fileObj — asli File (yoki Blob)
    const url = URL.createObjectURL(fileObj);
    setPreview(url);
    setFile(fileObj); // <-- ASOSIY: file obyektini saqlaymiz
    return false; // Upload komponentining avtomatik upload qilinishini to'xtatadi
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  // ad ???????/?

  return (
    <Modal
      title="Ijarachi qo'shish"
      style={{ top: "50%", transform: "translateY(-50%)" }}
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
  );
}

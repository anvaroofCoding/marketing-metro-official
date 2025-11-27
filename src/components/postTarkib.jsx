import { useAddTarkibMutation, useGetDepoQuery } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PostTarkib() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [addTashkilod, { isLoading }] = useAddTarkibMutation();
  const { data: depo, isLoading: loads } = useGetDepoQuery();
  const PostValues = async (value) => {
    try {
      const formData = new FormData();
      formData.append("tarkib", value.tarkib);
      formData.append("depo_id", value.depo_id);
      if (file) {
        formData.append("schema_image", file, file.name); // <-- MUHIM: file obyektini yuboramiz
      }
      await addTashkilod(formData).unwrap();
      form.resetFields();
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      setFile(null);
      setOpen(false);
      toast.success("Harakat tarkibi muvaffaqiyatli qo'shildi");
    } catch (error) {
      if (error.data.schema_image) {
        toast.error(error.data.schema_image[0]);
      }
    }
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

  return (
    <div>
      <Button
        variant="solid"
        color="green"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        size="middle"
      >
        Qo'shish
      </Button>
      <Modal
        centered
        title="Harakat tarkib qo'shish"
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
          setFile(null);
        }}
        onOk={() => form.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading || loads }}
      >
        <Form form={form} layout="vertical" onFinish={PostValues}>
          <Form.Item
            label="Harakat tarkibi nomi"
            name="tarkib"
            rules={[
              { required: true, message: "IHarakat tarkibi nomi kiriting!" },
            ]}
          >
            <Input placeholder="0001-0002-0003-0004" />
          </Form.Item>

          <Form.Item
            name="depo_id"
            label="Depo nomi"
            rules={[{ required: true, message: "Depo nomi kerak!" }]}
          >
            <Select
              placeholder="Deponi tanlang"
              options={
                depo?.results?.map((item) => ({
                  value: item.id,
                  label: item.nomi,
                })) || []
              }
            />
          </Form.Item>

          <Form.Item label="Harakat tarkibi chizmasi">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}> Chizmani yuklash</Button>
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

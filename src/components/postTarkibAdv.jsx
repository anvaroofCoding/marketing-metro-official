import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useCreateTrainPositionAdvMutation,
  useGetBannerForInputQuery,
  useGetTashkilodByinputQuery,
} from "@/services/api";
import "./CreateAdvertisements.css";
import { useNavigate } from "react-router-dom";

export default function PostTarkibAdv({ id, open, onClose }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    form.resetFields();
    onClose();
  };
  const { data, isLoading: dataLoading } = useGetBannerForInputQuery();
  const { data: tashkilod, isLoading: tashkilodLoading } =
    useGetTashkilodByinputQuery();
  const [createAdvent, { isLoading}] =
    useCreateTrainPositionAdvMutation();
  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);
  if (dataLoading || tashkilodLoading) return <Spin />;
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("position", id);
      formData.append("Reklama_nomi", values.Reklama_nomi);
      formData.append("Qurilma_turi", values.Qurilma_turi);
      formData.append("Ijarachi", values.Ijarachi);
      formData.append("Shartnoma_raqami", values.Shartnoma_raqami);
      formData.append(
        "Shartnoma_muddati_boshlanishi",
        values.Shartnoma_muddati_boshlanishi.format("YYYY-MM-DD")
      );
      formData.append(
        "Shartnoma_tugashi",
        values.Shartnoma_tugashi.format("YYYY-MM-DD")
      );
      formData.append("O_lchov_birligi", values.O_lchov_birligi);
      formData.append("Qurilma_narxi", parseFloat(values.Qurilma_narxi));
      formData.append("Egallagan_maydon", values.Egallagan_maydon);

      // Fayllar
      formData.append("Shartnoma_fayl", values.Shartnoma_fayl[0].originFileObj);
      formData.append("photo", values.photo[0].originFileObj);

      await createAdvent(formData);
      form.resetFields();
      closeModal();
      navigate(`/train/adver/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title="Reklama Qo'shish"
      open={isModalOpen}
      onCancel={closeModal}
      onOk={handleSubmit}
      okText="Saqlash"
      confirmLoading={isLoading}
      width={750}
      centered
      okButtonProps={{ className: "green-btn" }}
      cancelButtonProps={{ className: "green-cancel-btn" }}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="Reklama_nomi"
            label="Reklama nomi"
            rules={[{ required: true }]}
            className="green-input"
          >
            <Input placeholder="Reklama nomini kiriting" />
          </Form.Item>

          <Form.Item
            name="Qurilma_turi"
            label="Qurilma turi"
            rules={[{ required: true }]}
            className="green-select"
          >
            <Select
              showSearch
              placeholder="Qurilma turini tanlang"
              options={
                data?.results?.map((item) => ({
                  value: item.id,
                  label: item.qurilmaturi,
                })) || []
              }
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="Ijarachi"
            label="Ijarachi turi"
            rules={[{ required: true }]}
            className="green-select"
          >
            <Select
              showSearch
              placeholder="Ijarachini tanlang"
              options={
                tashkilod?.results?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []
              }
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="Shartnoma_raqami"
            label="Shartnoma raqami"
            rules={[{ required: true }]}
            className="green-input"
          >
            <Input placeholder="Shartnoma raqami" />
          </Form.Item>

          <Form.Item
            name="Shartnoma_muddati_boshlanishi"
            label="Shartnoma boshlanish sanasi"
            rules={[{ required: true }]}
            className="green-input"
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item
            name="Shartnoma_tugashi"
            label="Shartnoma tugashi"
            rules={[{ required: true }]}
            className="green-input"
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item
            name="O_lchov_birligi"
            label="O'lchov birligi"
            rules={[{ required: true }]}
            className="green-select"
          >
            <Select
              showSearch
              options={[
                { value: "dona", label: "Dona" },
                { value: "kv_metr", label: "Kvadrat Metr" },
                { value: "komplekt", label: "Komplekt" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="Qurilma_narxi"
            label="Qurilma narxi"
            rules={[{ required: true }]}
            className="green-input"
          >
            <Input placeholder="Narx" type="number" />
          </Form.Item>

          <Form.Item
            name="Egallagan_maydon"
            label="Egallagan maydon"
            rules={[{ required: true }]}
            className="green-input"
          >
            <Input placeholder="Maydon" />
          </Form.Item>

          <div className="col-span-2 flex gap-5">
            <Form.Item
              name="Shartnoma_fayl"
              label="Shartnoma fayli"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[{ required: true }]}
              className="green-file-input"
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Fayl tanlash</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="photo"
              label="Rasm"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[{ required: true }]}
              className="green-file-input"
            >
              <Upload beforeUpload={() => false} accept="image/*">
                <Button icon={<UploadOutlined />}>Rasm tanlash</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

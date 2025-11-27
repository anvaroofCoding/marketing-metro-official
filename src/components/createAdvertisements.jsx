import { useState } from "react";
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
  useCreateAdventMutation,
  useGetBannerForInputQuery,
  useGetTashkilodByinputQuery,
} from "@/services/api";
import "./createAdvertisementss.css";

export default function CreateAdvertisements({ id }) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading: dataLoading } = useGetBannerForInputQuery();
  const { data: tashkilod, isLoading: tashkilodLoading } =
    useGetTashkilodByinputQuery();

  const [createAdvent, { isLoading }] = useCreateAdventMutation();

  if (dataLoading || tashkilodLoading) return <Spin />;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // FormData yaratish
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <Button
        type="primary"
        onClick={openModal}
        size="large"
        style={{ backgroundColor: "#155d27", borderColor: "#155d27" }}
      >
        + Yangi Reklama Qo'shish
      </Button>

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
    </div>
  );
}

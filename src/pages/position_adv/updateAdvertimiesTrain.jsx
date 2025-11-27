"use client";

import { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useGetBannerForInputQuery,
  useGetTashkilodByinputQuery,
  useUpdateTrainAdvertimiesMutation,
} from "@/services/api";
import "../../components/createAdvertisements.css";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpdateAdvertisementsTrains({
  id,
  defaultData,
  position_id,
}) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading: dataLoading } = useGetBannerForInputQuery();
  const { data: tashkilod, isLoading: tashkilodLoading } =
    useGetTashkilodByinputQuery();
  const [updateAdvent, { isLoading, isError, error }] =
    useUpdateTrainAdvertimiesMutation();
  const initialValues = {
    Reklama_nomi: defaultData?.Reklama_nomi,
    Qurilma_turi: defaultData?.Qurilma_turi,
    Ijarachi: defaultData?.Ijarachi,
    Shartnoma_raqami: defaultData?.Shartnoma_raqami,
    O_lchov_birligi: defaultData?.O_lchov_birligi,
    Qurilma_narxi: defaultData?.Qurilma_narxi,
    Egallagan_maydon: defaultData?.Egallagan_maydon,
  };
  if (dataLoading || tashkilodLoading) return <></>;
  if (isError) {
    if (error.data.Shartnoma_muddati_boshlanish) {
      toast.error(error.data.Shartnoma_muddati_boshlanish[0]);
    }
    if (error.data.Shartnoma_tugashi) {
      toast.error(error.data.Shartnoma_tugashi[0]);
    }
    if (error.data.photo) {
      toast.error(error.data.photo[0]);
    }
    if (error.data.position) {
      toast.error(error.data.position[0]);
    }
  }
  const openModal = () => {
    toast.warning(
      "Reklamani tahrirlamoqchi bo'lsangiz sanalar, file va rasmlar qayta kiring"
    );
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("position", position_id);
      formData.append("Reklama_nomi", values.Reklama_nomi);
      formData.append("Qurilma_turi", values.Qurilma_turi);
      formData.append("Ijarachi", values.Ijarachi);
      formData.append("Shartnoma_raqami", values.Shartnoma_raqami);
      formData.append(
        "Shartnoma_muddati_boshlanishi",
        values.Shartnoma_muddati_boshlanishi?.format("YYYY-MM-DD") || ""
      );
      formData.append(
        "Shartnoma_tugashi",
        values.Shartnoma_tugashi?.format("YYYY-MM-DD") || ""
      );
      formData.append("O_lchov_birligi", values.O_lchov_birligi);
      formData.append("Qurilma_narxi", parseFloat(values.Qurilma_narxi));
      formData.append("Egallagan_maydon", values.Egallagan_maydon);
      values.Shartnoma_fayl?.forEach((f) =>
        formData.append("Shartnoma_fayl", f.originFileObj)
      );
      values.photo?.forEach((f) => formData.append("photo", f.originFileObj));
      await updateAdvent({ id, data: formData });
      form.resetFields();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <Button
        onClick={openModal}
        className="bg-yellow-600/60 hover:bg-yellow-600/80 duration-400"
      >
        <Pencil /> Shartnomani tahrirlash
      </Button>

      <Modal
        title="Reklamani Tahrirlash"
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
        <Form form={form} layout="vertical" initialValues={initialValues}>
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
                className="green-file-input"
              >
                <Upload beforeUpload={() => false}>
                  <Button className="bg-green-600">
                    <UploadOutlined /> Fayl tanlash
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="photo"
                label="Rasm"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                className="green-file-input"
              >
                <Upload beforeUpload={() => false} accept="image/*">
                  <Button className="bg-green-600">
                    <UploadOutlined /> Rasm tanlash
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

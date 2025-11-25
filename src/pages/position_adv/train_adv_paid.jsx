import { useState } from "react";
import { Button, Form, InputNumber, Modal, Input } from "antd";
import { BanknoteArrowDown } from "lucide-react";
import { useAddSumForTarkibMutation } from "@/services/api";
import { toast } from "sonner";

export default function Train_adv_paid({ id }) {
  console.log(id);
  const [open, setOpen] = useState(false);
  const [sum, setSum] = useState(0);
  const [comment, setComment] = useState("");
  const [addSum, { isLoading }] = useAddSumForTarkibMutation();
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const formData = {
        reklama: id,
        Shartnomasummasi: sum,
        comment: comment,
      };
      await addSum(formData).unwrap();
      setOpen(false);
      form.resetFields();
      setComment("");
      setSum(0);
      toast.success("To'lov muvaffaqiyatli qo'shildi");
    } catch (error) {
      console.error("Error adding sum:", error);
      toast.error("To'lov qo'shilmadi");
      if (error.data.Shartnomasummasi) {
        toast.error(error.data.Shartnomasummasi[0]);
      }
    }
  };

  return (
    <div>
      <Button
        color="green"
        variant="solid"
        onClick={() => setOpen(true)}
        style={{
          color: "white",
          backgroundColor: "green",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        To'lash <BanknoteArrowDown />
      </Button>

      <Modal
        title="Siz 1-marta tolov qilyapsiz"
        open={open}
        width={400}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={isLoading ? "To'lov qilinmoqda..." : "To'lov qilish"}
        cancelText="To'lovni bekor qilish"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="To'lov summasi"
            name="tolov_summasi"
            rules={[{ required: true, message: "To'lov summasi majburiy!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="To'lov summasini yozing"
              controls={false}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              parser={(value) => value.replace(/\s/g, "")}
              onChange={(value) => setSum(value)}
            />
          </Form.Item>

          <Form.Item label="Izoh" name="comment">
            <Input.TextArea
              rows={3}
              placeholder="To'lov haqida izoh yozing"
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

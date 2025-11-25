import { useAddTarkibPositionMutation } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function PostTarkibPosition({ id }) {
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const [form] = Form.useForm();
  const [addTashkilod, { isLoading }] = useAddTarkibPositionMutation();
  const PostValues = async (value) => {
    try {
      const formData = {
        harakat_tarkibi_input: id,
        position: value.position,
      };
      await addTashkilod(formData).unwrap();
      form.resetFields();
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      dispatch(closeModal());
      toast.success("Harakat tarkibining  joyi muvaffaqiyatli qo'shildi");
    } catch (error) {
      if (error.data.position) {
        toast.error(error.data.position[0]);
      }
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        centered
        title="Harakat tarkib qo'shish"
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
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading }}
      >
        <Form form={form} layout="vertical" onFinish={PostValues}>
          <Form.Item
            label="Harakat tarkibining reklama joyi"
            name="position"
            rules={[
              {
                required: true,
                message: "Harakat tarkibining reklama joyini kiriting!",
              },
            ]}
          >
            <Input placeholder="1 yoki 2 ... " />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

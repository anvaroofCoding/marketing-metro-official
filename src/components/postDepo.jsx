import { useAddDepoMutation } from "@/services/api";
import { closeModal } from "@/services/modalSplice";
import { Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function PostDepo() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const [form] = Form.useForm();
  const [addDepo, { isLoading }] = useAddDepoMutation();
  const PostValues = async (value) => {
    try {
      const formData = { nomi: value.name };
      await addDepo(formData).unwrap();
      form.resetFields();
      dispatch(closeModal());
      toast.success("Depo muvaffaqiyatli qo'shildi");
    } catch (error) {
      if (error.data.nomi) {
        toast.warning("Bunday depo mavjud");
      }
    }
  };
  return (
    <div>
      <Modal
        centered
        title="Depo qo'shish"
        open={isOpen}
        onCancel={() => {
          dispatch(closeModal());
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Deponi saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading }}
      >
        <Form form={form} layout="vertical" onFinish={PostValues}>
          <Form.Item
            label="Depo nomi"
            name="name"
            rules={[{ required: true, message: "Depo nomini kiriting!" }]}
          >
            <Input placeholder="Depo nomini yozing" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

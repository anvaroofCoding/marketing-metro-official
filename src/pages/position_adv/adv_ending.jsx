import { Modal } from "antd";
import { CalendarMinus } from "lucide-react";
import { useState } from "react";
import { useDeleteAdventTrainMutation } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Ending_Adv_train({ ids }) {
  const [deleteAdv, { isLoading }] = useDeleteAdventTrainMutation();
  const [open, setOpen] = useState(false);
  console.log(ids);
  const showConfirm = () => setOpen(true);

  const handleOk = async () => {
    try {
      await deleteAdv(ids).unwrap();
      toast.success("Shartnoma muvaffaqiyatli tugatildi!");
      setOpen(false);
      window.history.back();
    } catch (error) {
      toast.error("Xatolik bor:" + " " + error);
    }
  };
  const handleCancel = () => setOpen(false);
  return (
    <>
      <Button
        onClick={showConfirm}
        className="bg-red-600/60 hover:bg-red-600/80 duration-400"
      >
        <CalendarMinus size={18} />
        {isLoading ? "Tugatilmoqda..." : "Shartnomani tugatish"}
      </Button>

      <Modal
        title="Shartnomani tugatish"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Ha, tugataman"
        cancelText="Yo'q"
        centered
      >
        <p>Rostan ham shartnomani tugatmoqchimisiz?</p>
      </Modal>
    </>
  );
}

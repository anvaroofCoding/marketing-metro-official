import { PlusOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Image, Input, Modal, Spin, Table } from "antd";
import { useState } from "react";
import { Edit2, Eye, MoreVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "@/services/modalSplice";
import { toast } from "sonner";
import {
  useGetTarkibDetailsQuery,
  useGetTarkibPositionQuery,
  useUpdateTarkibPositionMutation,
} from "@/services/api";
import PostTarkibPosition from "@/components/post_tarkib_position";
import { useNavigate, useParams } from "react-router-dom";
import PostTarkibAdv from "@/components/postTarkibAdv";
export default function Tarkib_Details() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpenModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedId(null); // eski idni tozalash
  };
  const { id } = useParams();
  const [visible, setVisible] = useState(20);
  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateTarkibPositionMutation();
  const [value, setValue] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data: positions, isLoading: positionsLoading } =
    useGetTarkibPositionQuery();
  const { data: tarkib_details, isLoading: Tarkib_loading } =
    useGetTarkibDetailsQuery(id);
  const handleEditSubmit = async (values) => {
    const formData = {
      position: values.position,
    };
    console.log(formData, editingId);
    try {
      await updateTashkilod({ id: editingId, formData }).unwrap();
      toast.success("Ma'lumot muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.resetFields();
    } catch (err) {
      toast.error(
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring" + " " + err?.message
      );
      console.log(err);
    }
  };
  if (positionsLoading || Tarkib_loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const filter_tarkib_position = positions?.results?.filter((item) => {
    return item.harakat_tarkibi == tarkib_details.tarkib;
  });
  const filteredPositions = filter_tarkib_position?.filter((item) => {
    const search = value.toLowerCase();

    const positionMatch = item.position
      ?.toString()
      .toLowerCase()
      .includes(search);

    const ijarachiMatch = item.tarkib_advertisement?.ijarachi_name
      ?.toLowerCase()
      .includes(search);

    return positionMatch || ijarachiMatch;
  });
  console.log(filteredPositions);
  const columns = [
    {
      title: "Nomer",
      key: "index",
      render: (_, record, index) => (
        <span className="font-semibold">{index + 1}</span>
      ),
    },
    {
      title: "Joy raqami",
      dataIndex: "position",
      key: "position",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Harakat tarkibi",
      dataIndex: "harakat_tarkibi",
      key: "harakat_tarkibi",
      render: (value) => value || "N/A",
    },
    {
      title: "Ijarachi",
      key: "ijarachi",
      render: (_, record) =>
        record.tarkib_advertisement?.ijarachi_name ? (
          record.tarkib_advertisement.ijarachi_name
        ) : (
          <span className="text-red-700">Bo'sh joy</span>
        ),
    },
    {
      title: "Reklamani yaratuvchi",
      key: "created_by",
      render: (_, record) =>
        record.tarkib_advertisement?.created_by ? (
          record.tarkib_advertisement.created_by
        ) : (
          <span className="text-red-700">-</span>
        ),
    },
    {
      title: "Reklama yaratilgan sana",
      key: "created_at",
      render: (_, record) =>
        record.tarkib_advertisement?.created_at ? (
          record.tarkib_advertisement.created_at
        ) : (
          <span className="text-red-700">-</span>
        ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 80,
      render: (_, record) => {
        const items = [
          {
            key: "view",
            label: (
              <span className="flex items-center gap-2 text-green-800 ">
                <Eye size={14} />{" "}
                {record.tarkib_advertisement
                  ? "Reklamani ko'rish"
                  : "Reklama qo'shish"}
              </span>
            ),
            onClick: () => {
              if (record.tarkib_advertisement) {
                navigate(`/train/adver/${record.id}`);
              } else {
                toast(`${record.position}-raqamli joy bo'sh`, {
                  description: "Ijarachi qo'shib band qilishingiz mumkin!",
                });
                handleOpenModal(record.id); // faqat state o‘zgartiramiz
              }
            },
          },
          {
            key: "edit",
            label: (
              <span className="flex items-center gap-2 text-orange-700">
                <Edit2 size={14} /> Tahrirlash
              </span>
            ),
            onClick: () => {
              setEditingId(record.id);
              form.setFieldsValue({ position: record.position });
              setOpen(true);
            },
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MoreVertical size={18} />} />
          </Dropdown>
        );
      },
    },
  ];
  return (
    <div className="w-full min-h-screen ">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center p-5 gap-5 bg-gradient-to-r from-green-800 via-green-800 to-green-800 rounded-xl mb-5">
            <div
              className="absolute inset-0 
        bg-[url('/naqshtitle.png')] 
        bg-repeat 
        bg-center 
        bg-[length:400px_400px] 
        opacity-20
        pointer-events-none
        z-0"
            ></div>

            <div className="rounded-full overflow-hidden w-[100px] h-[100px]">
              <Image
                src={tarkib_details.schema_image}
                width={100}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-5xl font-bold text-white solid">
                {tarkib_details.tarkib}
              </h1>
              <p className="text-white solid text-lg">
                Harakat tarkibidagi barcha joylar
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size="middle"
              variant="outlined"
              className="md:flex-1 bg-transparent"
            />
            <Button
              variant="solid"
              color="green"
              icon={<PlusOutlined />}
              onClick={() => dispatch(openModal())}
              size="middle"
            >
              Qo'shish
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredPositions.slice(0, visible)}
          rowKey="id"
          pagination={false}
        />

        {filteredPositions.length > visible && (
          <div className="flex justify-center mt-6">
            <Button
              variant="solid"
              color="green"
              size="large"
              onClick={() => setVisible((prev) => prev + 10)}
            >
              Ko‘proq ko‘rish
              <RightOutlined size={18} />
            </Button>
          </div>
        )}

        {filter_tarkib_position?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Hech qanday tashkilot topilmadi
            </p>
            <Button
              color="green"
              variant="solid"
              onClick={() => dispatch(openModal())}
              size="large"
            >
              Yangi ma'lumot qo'shish
            </Button>
          </div>
        )}
      </div>

      <Modal
        centered
        title="Harakat tarkibining joyini tahrirlash"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText={isLoading ? "Saqlanmoqda..." : "Saqlash"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="position"
            label="Harakat tarkibining reklama joyi"
            rules={[{ required: true, message: "Harakat tarkibi kerak!" }]}
          >
            <Input placeholder="Harakat tarkibini tanlang" />
          </Form.Item>
        </Form>
      </Modal>

      <PostTarkibPosition id={tarkib_details.tarkib} />
      {selectedId && (
        <PostTarkibAdv
          id={selectedId}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

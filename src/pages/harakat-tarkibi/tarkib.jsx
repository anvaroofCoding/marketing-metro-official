import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { Edit2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  useGetDepoQuery,
  useGetTarkibQuery,
  useUpdateTarkibMutation,
} from "@/services/api";
import PostTarkib from "@/components/postTarkib";
import { useNavigate } from "react-router-dom";
export default function Tarkib() {
  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateTarkibMutation();
  const [file, setFile] = useState(null);
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const limit = 28;
  const { data: tarkib, isLoading: positionsLoading } = useGetTarkibQuery({
    search: value,
    page,
    limit,
  });
  const { data: depo, isLoading: loadin } = useGetDepoQuery();
  const handleEditSubmit = async (values) => {
    const formData = new FormData();
    formData.append("tarkib", values.tarkib);
    formData.append("depo_id", values.depo_id);
    if (file) formData.append("schema_image", file, file.name);
    try {
      await updateTashkilod({ id: editingId, formData }).unwrap();
      toast.success("Ma'lumot muvaffaqiyatli tahrirlandi");
      setOpen(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring" + " " + err?.message
      );
      console.log(err);
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
  if (positionsLoading || loadin) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen ">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 solid">
            Harakat tarkiblari ro'yxati
          </h1>
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
            <PostTarkib />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {tarkib?.results?.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="mb-4 flex justify-start items-center gap-4">
                <div>
                  <Image
                    src={record.schema_image || "/placeholder.svg"}
                    alt={record.name}
                    className="w-20 h-20 rounded-full"
                    width={100}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {record.depo}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {record.tarkib || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full">
                <a
                  href={record?.schema_image}
                  download
                  className="w-full"
                  target="_blank"
                >
                  <Button
                    variant="solid"
                    color="green"
                    size="small"
                    block
                    icon={<Eye size={14} />}
                  >
                    Chizmani ko'rish
                  </Button>
                </a>
                <Button
                  variant="solid"
                  color="blue"
                  size="small"
                  block
                  icon={<Eye size={14} />}
                  onClick={() => {
                    navigate(`/train/${record.id}`);
                  }}
                >
                  Joylarni ko'rish
                </Button>
                <Button
                  size="small"
                  style={{ padding: "3px" }}
                  onClick={() => {
                    setEditingId(record.id);
                    form.setFieldsValue({
                      tarkib: record.tarkib,
                      depo_id: record.depo_id,
                    });
                    if (record.schema_image) setPreview(record.schema_image);
                    setOpen(true);
                  }}
                  variant="solid"
                  color="orange"
                  icon={<Edit2 size={14} />}
                />
              </div>
            </div>
          ))}
        </div>

        {tarkib?.results && (
          <div className="flex justify-end">
            <Pagination
              current={page}
              pageSize={limit}
              total={tarkib.count}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}
        {tarkib?.results?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Hech qanday tashkilot topilmadi
            </p>
          </div>
        )}
      </div>

      <Modal
        centered
        title="Harakat tarkibini tahrirlash"
        open={open}
        onOk={() => form.submit()}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setFile(null);
          setPreview(null);
        }}
        okText={isLoading ? "Saqlanmoqda..." : "Saqlash"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="tarkib"
            label="Harakat tarkibi nomi"
            rules={[{ required: true, message: "Nomi kerak!" }]}
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

          <Form.Item label="Harakat tarkib rasmi">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Yuklash</Button>
            </Upload>
            {preview && (
              <img
                src={preview || "/placeholder.svg"}
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

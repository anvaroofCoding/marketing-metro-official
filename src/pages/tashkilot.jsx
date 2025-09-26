"use client";

import {
  EyeFilled,
  PlusCircleFilled,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Spin,
  Tooltip,
  Upload,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetTashkilodQuery,
  useUpdateTashkilodMutation,
} from "../services/api";
import { Edit2, EyeIcon, Phone, Building2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "@/services/modalSplice";
import PostTashkilot from "@/components/postTashkilot";

export default function TashkilotImproved() {
  notification.config({
    placement: "top",
    duration: 3,
  });

  const [editingId, setEditingId] = useState(null);
  const [updateTashkilod, { isLoading }] = useUpdateTashkilodMutation();
  const [file, setFile] = useState(null);
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { data: positions, isLoading: positionsLoading } = useGetTashkilodQuery(
    {
      search: value,
    }
  );

  const EditValues = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("contact_number", values.contact_number);
    if (file) {
      formData.append("logo", file, file.name);
    }

    try {
      await updateTashkilod({ id: editingId, formData }).unwrap();
      notification.success({ message: "Ma'lumot muvaffaqiyatli tahrirlandi" });
      setOpen(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Update error:", err);
      notification.error({
        message: "Xatolik yuz berdi",
        description: err?.data,
      });
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

  if (positionsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className=" mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-500 mb-2">
              Tashkilodlarni ro'yxatga olish
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
            <div className="flex-1 max-w-lg">
              <Input
                placeholder="Tashkilot nomi, telefon raqami yoki ID bo'yicha qidirish..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                size="large"
                className="rounded-xl border-gray-200 shadow-sm hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleFilled />}
              onClick={() => dispatch(openModal())}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Yangi tashkilot qo'shish
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {positions?.results && (
          <div className="mb-6">
            <p className="text-gray-600 font-medium">
              Jami {positions.results.length} ta tashkilot topildi
            </p>
          </div>
        )}

        {/* Optimized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {positions?.results?.map((record) => {
            return (
              <div
                key={record.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden hover:scale-[1.02] hover:-translate-y-1"
              >
                {/* Header with Logo and Basic Info */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 p-3 shadow-md">
                        <Image
                          width={40}
                          height={40}
                          src={record.logo || "/placeholder.svg"}
                          alt={record.name}
                          className="w-full h-full object-contain rounded-lg"
                          fallback="/api/placeholder/40/40"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                        <Building2 className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-900 text-lg  mb-2 ">
                          {record.name.substring(0, 20)}...
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ID: #{record.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50/80 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Aloqa raqami
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {record.contact_number || "Kiritilmagan"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6">
                  <div className="flex space-x-3">
                    {record.advertisement ? (
                      <Tooltip title="Reklamani ko'rish" placement="top">
                        <button
                          onClick={() => navigate(`position/${record.id}`)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <EyeFilled className="text-sm" />
                          <span>Ko'rish</span>
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Reklama qo'shish" placement="bottom">
                        <button
                          onClick={() =>
                            navigate(`tashkilotni-royxatga-olish/${record.id}`)
                          }
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>Qo'shish</span>
                        </button>
                      </Tooltip>
                    )}

                    <Tooltip title="Tahrirlash" placement="top">
                      <button
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => {
                          setEditingId(record.id); // shu joyda ID-ni set qilamiz
                          form.setFieldsValue({
                            name: record.name,
                            contact_number: record.contact_number,
                          });
                          if (record.logo) setPreview(record.logo);
                          setOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl" />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {positions?.results?.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hech qanday tashkilot topilmadi
            </h3>
            <p className="text-gray-600 mb-6">
              Qidiruv so'zingizni o'zgartiring yoki yangi tashkilot qo'shing
            </p>
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleFilled />}
              onClick={() => dispatch(openModal())}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 rounded-xl px-8"
            >
              Birinchi tashkilotni qo'shish
            </Button>
          </div>
        )}
      </div>

      <Modal
        title="Ijarachini tahrirlash"
        style={{ top: "50%", transform: "translateY(-50%)" }}
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
        okText="Yangilash"
        cancelText="Bekor qilish"
        okButtonProps={{ loading: isLoading }}
      >
        <Form form={form} layout="vertical" onFinish={EditValues}>
          <Form.Item
            label="Ijarachi nomi"
            name="name"
            rules={[{ required: true, message: "Ijarachi nomini kiriting!" }]}
          >
            <Input placeholder="Ijarachi nomini yozing" />
          </Form.Item>

          <Form.Item
            label="Telefon raqami"
            name="contact_number"
            rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          {/* NOTE: formItem-da name="logo" bermadim — file-ni alohida state bilan boshqaramiz */}
          <Form.Item label="Ijarchi Logosi">
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Logoni yuklash</Button>
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

      <PostTashkilot />
    </div>
  );
}

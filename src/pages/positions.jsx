import {
  Edit3,
  Plus,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  User,
  Phone,
  Download,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  Handshake,
} from "lucide-react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Upload as AntUpload,
  notification,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateAdventMutation,
  useDeleteAdventMutation,
  useGetAdventQuery,
  useGetTashkilodQuery,
  useUpdateAdventMutation,
} from "../services/api";

const { Option } = Select;

export default function AdvertisementDetail() {
  const { ids } = useParams();
  notification.config({
    placement: "top",
    duration: 3,
  });

  const {
    data,
    isLoading: getLoading,
    error: getError,
    refetch,
  } = useGetAdventQuery();

  const {
    data: getTashkilod,
    isLoadin: load,
    isError: err,
  } = useGetTashkilodQuery();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [createAdvent, { isLoading: postLoading }] = useCreateAdventMutation();
  const [updateAdvent, { isLoading: updating, error }] =
    useUpdateAdventMutation();
  const [deleteAdvent, { isLoading: deleteLoading }] =
    useDeleteAdventMutation();

  if (getLoading || postLoading || updating || deleteLoading || load)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );

  console.log(error);

  if (getError || err)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Xatolik yuz berdi
          </h3>
          <p className="text-slate-600">
            Ma'lumotlarni yuklashda muammo yuzaga keldi
          </p>
        </div>
      </div>
    );

  const reklama = data?.results?.find((item) => item.position == ids);

  const handleOpen = () => {
    if (reklama) {
      form.setFieldsValue({
        ...reklama,
        Shartnoma_muddati_boshlanishi: moment(
          reklama.Shartnoma_muddati_boshlanishi
        ),
        Shartnoma_tugashi: moment(reklama.Shartnoma_tugashi),
      });
    }
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("position", ids);
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
      formData.append("Qurilma_narxi", values.Qurilma_narxi);
      formData.append("Egallagan_maydon", values.Egallagan_maydon || "-");
      formData.append("Shartnoma_summasi", values.Shartnoma_summasi);

      if (values.Shartnoma_fayl?.fileList?.[0]?.originFileObj) {
        formData.append(
          "Shartnoma_fayl",
          values.Shartnoma_fayl.fileList[0].originFileObj
        );
      }
      if (values.photo?.fileList?.[0]?.originFileObj) {
        formData.append("photo", values.photo.fileList[0].originFileObj);
      }

      if (reklama) {
        await updateAdvent({ id: reklama.id, formData }).unwrap();
        notification.success({
          message: "Ma'lumotlar muvaffaqiyatli yangilandi",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        });
      } else {
        await createAdvent(formData).unwrap();
        notification.success({
          message: "Ma'lumotlar muvaffaqiyatli to'ldirildi",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        });
      }

      await refetch();
      setOpen(false);
      form.resetFields();
    } catch (error) {
      notification.warning({
        message: `Diqqat ${error.data.photo}`,
        description: "Iltimos reklama rasmini qayta yuborishingiz shart!",
        icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdvent(id).unwrap();
      notification.success({
        message: "Shartnoma muvaffaqiyatli yakunlandi",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
      refetch();
    } catch (err) {
      notification.error({
        message: "Xatolik yuz berdi",
        description: err?.data?.message || JSON.stringify(err),
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {reklama ? (
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div
              className="absolute inset-0 
             bg-[url('/naqshtitle.png')] 
             bg-repeat 
             bg-center 
             bg-[length:400px_400px] 
             opacity-20
             pointer-events-none
             z-10"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-blue-600/90"></div>
            <div className="relative md:p-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-shrink-0 bg-white/20 border border-white rounded-xl">
                  <div>
                    <img
                      src={reklama.ijarachi.logo || "/placeholder.svg"}
                      width={280}
                      height={180}
                      alt="reklama rasmi"
                      className="relative w-50 z-20 "
                      // fallback="/impactful-advertisement.png"
                    />
                  </div>
                </div>

                <div className="flex-1 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {reklama.Reklama_nomi}
                  </h1>
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-blue-200" />
                    <p className="text-xl text-blue-100">
                      Ijarachi:{" "}
                      <span className="font-semibold text-white">
                        {reklama.ijarachi.name}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 mb-6">
                      <PhoneCall className="w-6 h-6 text-blue-200" />
                      <p className="text-xl text-blue-100">
                        Telefon raqami:{" "}
                        <span className="font-semibold text-white">
                          {reklama.ijarachi.contact_number}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleOpen}
                    className="group flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <Edit3 className="w-5 h-5 text-white " />
                    <span className="font-medium text-white">
                      Ma'lumotlarni tahrirlash
                    </span>
                  </button>

                  <Popconfirm
                    title="Reklamani tugatish"
                    description="Haqiqatan ham bu reklamani tugatmoqchimisiz?"
                    onConfirm={() => handleDelete(reklama.id)}
                    okText="Ha, tugatish"
                    cancelText="Bekor qilish"
                    okButtonProps={{ danger: true }}
                  >
                    <button className="group flex items-center gap-3 bg-red-500/50 hover:bg-red-500/60 backdrop-blur-sm border border-red-300/30 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <Handshake className="w-5 h-5 text-red-200 " />
                      <span className="font-medium text-red-100">
                        Reklamani tugatish
                      </span>
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Contract Information Card */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Shartnoma ma'lumotlari
                </h3>
              </div>

              <div className="space-y-6">
                <div className="group/item">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Shartnoma raqami
                  </p>
                  <p className="text-lg font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors">
                    {reklama.Shartnoma_raqami}
                  </p>
                </div>

                <div className="group/item">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Qurilma turi
                  </p>
                  <p className="text-lg font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors">
                    {reklama.Qurilma_turi}
                  </p>
                </div>

                <div className="group/item">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Egallagan maydoni
                  </p>
                  <p className="text-lg font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors">
                    {reklama.Egallagan_maydon} {reklama.O_lchov_birligi}
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Muddat</p>
                    <p className="text-base font-semibold text-slate-800">
                      {moment(reklama.Shartnoma_muddati_boshlanishi).format(
                        "DD.MM.YYYY"
                      )}{" "}
                      - {moment(reklama.Shartnoma_tugashi).format("DD.MM.YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Card */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Moliyaviy ma'lumotlar
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Qurilma narxi
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {reklama.Qurilma_narxi?.toLocaleString()} so'm
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    Shartnoma summasi
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {reklama.Shartnoma_summasi?.toLocaleString()} so'm
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] md:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Shartnoma hujjatlari
                </h3>
              </div>

              <div className="space-y-6">
                <div className="group/item">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Telefon raqami
                  </p>
                  <p className="text-lg font-semibold text-slate-800 group-hover/item:text-purple-600 transition-colors">
                    {reklama.contact_number}
                  </p>
                </div>

                {reklama.Shartnoma_fayl && (
                  <a
                    href={reklama.Shartnoma_fayl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group/download"
                  >
                    <Download className="w-5 h-5 text-slate-600 group-hover/download:text-blue-600 transition-colors" />
                    <span className="font-medium text-slate-700 group-hover/download:text-blue-600 transition-colors">
                      Shartnoma faylini yuklab olish
                    </span>
                  </a>
                )}

                {reklama.photo && (
                  <a
                    href={reklama.photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group/download"
                  >
                    <Download className="w-5 h-5 text-slate-600 group-hover/download:text-purple-600 transition-colors" />
                    <span className="font-medium text-slate-700 group-hover/download:text-purple-600 transition-colors">
                      Reklama rasmini yuklab olish
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Ma'lumot topilmadi
            </h3>
            <p className="text-slate-600 mb-8">
              Bu pozitsiya uchun reklama ma'lumotlari mavjud emas
            </p>
            <button
              onClick={handleOpen}
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl mx-auto"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Yangi reklama qo'shish
            </button>
          </div>
        </div>
      )}

      <Modal
        title={
          <div className="flex items-center gap-3 text-2xl font-bold text-slate-800 pb-4 border-b border-slate-200">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              {reklama ? (
                <Edit3 className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </div>
            {reklama ? "Reklamani tahrirlash" : "Yangi reklama qo'shish"}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        width={900}
        className="top-8"
        okButtonProps={{
          size: "large",
          className:
            "px-8 h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700",
        }}
        cancelButtonProps={{
          size: "large",
          className: "px-8 h-12 rounded-xl font-semibold",
        }}
      >
        <Form form={form} layout="vertical" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="Reklama_nomi"
              label={
                <span className="font-semibold text-slate-700">
                  Reklama nomi
                </span>
              }
              rules={[{ required: true, message: "Reklama nomini kiriting" }]}
            >
              <Input
                placeholder="Reklama nomini kiriting"
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="Qurilma_turi"
              label={
                <span className="font-semibold text-slate-700">
                  Qurilma turi
                </span>
              }
              rules={[{ required: true, message: "Qurilma turini kiriting" }]}
            >
              <Input
                placeholder="Masalan: banner, monitor..."
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="Ijarachi"
              label={
                <span className="font-semibold text-slate-700">Ijarachi</span>
              }
              rules={[{ required: true, message: "Ijarachi nomini kiriting" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="Ijarachini tanlang"
                optionFilterProp="children"
                className="rounded-xl"
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {getTashkilod?.results?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="Shartnoma_raqami"
              label={
                <span className="font-semibold text-slate-700">
                  Shartnoma raqami
                </span>
              }
              rules={[
                { required: true, message: "Shartnoma raqamini kiriting" },
              ]}
            >
              <Input
                placeholder="Shartnoma raqami"
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="Shartnoma_muddati_boshlanishi"
              label={
                <span className="font-semibold text-slate-700">
                  Shartnoma boshlanish sanasi
                </span>
              }
              rules={[
                { required: true, message: "Boshlanish sanasini tanlang" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="Shartnoma_tugashi"
              label={
                <span className="font-semibold text-slate-700">
                  Shartnoma tugash sanasi
                </span>
              }
              rules={[{ required: true, message: "Tugash sanasini tanlang" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="O_lchov_birligi"
              label={
                <span className="font-semibold text-slate-700">
                  O'lchov birligi
                </span>
              }
              rules={[{ required: true, message: "O'lchov birligini tanlang" }]}
            >
              <Select
                placeholder="O'lchov birligini tanlang"
                size="large"
                className="rounded-xl"
              >
                <Select.Option value="komplekt">Komplekt</Select.Option>
                <Select.Option value="kv_metr">Kvadrat metr</Select.Option>
                <Select.Option value="dona">Dona</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="Qurilma_narxi"
              label={
                <span className="font-semibold text-slate-700">
                  Qurilma narxi (so'm)
                </span>
              }
              rules={[{ required: true, message: "Qurilma narxini kiriting" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                size="large"
                className="rounded-xl"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="Shartnoma_summasi"
              label={
                <span className="font-semibold text-slate-700">
                  Shartnoma summasi (so'm)
                </span>
              }
              rules={[
                { required: true, message: "Shartnoma summasini kiriting" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1000}
                size="large"
                className="rounded-xl"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="Egallagan_maydon"
              label={
                <span className="font-semibold text-slate-700">
                  Egallagan maydon
                </span>
              }
            >
              <Input
                placeholder="Masalan: 2.5 yoki -"
                size="large"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Form.Item
              name="Shartnoma_fayl"
              label={
                <span className="font-semibold text-slate-700">
                  Shartnoma fayli
                </span>
              }
            >
              <AntUpload beforeUpload={() => false}>
                <Button
                  icon={<Upload className="w-5 h-5" />}
                  size="large"
                  className="w-full h-12 rounded-xl font-semibold border-slate-200 hover:border-blue-400 hover:text-blue-600"
                >
                  Fayl yuklash
                </Button>
              </AntUpload>
            </Form.Item>

            <Form.Item
              name="photo"
              label={
                <span className="font-semibold text-slate-700">
                  Reklama rasmi
                </span>
              }
            >
              <AntUpload listType="picture" beforeUpload={() => false}>
                <Button
                  icon={<Upload className="w-5 h-5" />}
                  size="large"
                  className="w-full h-12 rounded-xl font-semibold border-slate-200 hover:border-blue-400 hover:text-blue-600"
                >
                  Rasm yuklash
                </Button>
              </AntUpload>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

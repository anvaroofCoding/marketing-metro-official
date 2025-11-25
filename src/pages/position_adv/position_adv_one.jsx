import {
  Card,
  Divider,
  List,
  Tag,
  Typography,
  Empty,
  Badge,
  Button,
  Popconfirm,
  Menu,
  Dropdown,
} from "antd";
import {
  Calendar,
  FileText,
  User,
  Ruler,
  Wallet,
  ImageUp,
  File,
  BanknoteArrowDown,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import Train_adv_paid from "./train_adv_paid";
import { toast } from "sonner";
import { useState } from "react";
import { useDeleteAdventTrainPaidMutation } from "@/services/api";
const { Title } = Typography;
function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  } catch {
    return dateString;
  }
}
export default function Position_adv_one({ data }) {
  const adv = data?.tarkib_advertisement;
  const [deleteAdv, { isLoading }] = useDeleteAdventTrainPaidMutation();
  const onDelete = async (id) => {
    try {
      await deleteAdv(id).unwrap();
      toast.success(`To'lov o‘chirildi ${id}`);
    } catch (e) {
      toast.error("O‘chirishda xatolik");
      console.log(e);
    }
  };

  return (
    <div className="w-full mt-10 ">
      <Card className="rounded-2xl shadow-xl bg-white">
        <div className="flex items-center gap-3">
          <Badge color="green" />
          <Title level={2} className="text-green-800 font-bold">
            Harakat tarkibidagi reklama ma'lumotlari
          </Title>
        </div>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chap blok */}
          <Card className="rounded-xl shadow-md bg-green-50 border-none p-4">
            <div className="space-y-4 text-lg">
              <p className="flex items-center gap-2 text-green-900">
                <Ruler size={20} />
                <span className="font-semibold">Egallangan maydon:</span>
                {adv?.Egallagan_maydon} {adv?.O_lchov_birligi}
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <Wallet size={20} />
                <span className="font-semibold">Banner narxi:</span>
                <Tag color="green" className="text-base px-2 py-1">
                  {adv?.Qurilma_narxi} so'm
                </Tag>
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <FileText size={20} />
                <span className="font-semibold">Shartnoma raqami:</span>
                {adv?.Shartnoma_raqami}
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <Calendar size={20} />
                <span className="font-semibold">Yaratilgan sana:</span>
                {adv?.created_at}
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <User size={20} />
                <span className="font-semibold">Yaratuvchi:</span>
                <Tag color="blue">{adv?.created_by}</Tag>
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <ImageUp size={20} />
                <span className="font-semibold">Reklama rasmi:</span>
                {adv?.photo && (
                  <a
                    href={adv.photo}
                    download="reklama_rasmi.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="link" color="green">
                      Rasmni yuklab olish
                    </Button>
                  </a>
                )}
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <File size={20} />
                <span className="font-semibold">Shartnoma fayli:</span>
                {adv?.Shartnoma_fayl && (
                  <a
                    href={adv.Shartnoma_fayl}
                    download="shartnoma.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="link" color="green">
                      Faylni yuklab olish
                    </Button>
                  </a>
                )}
              </p>
            </div>
          </Card>
          <Card className="rounded-xl shadow-md bg-green-50 border-none p-4">
            <div className="flex justify-between items-center">
              <Title
                level={4}
                className="text-green-900 mb-3 flex items-center gap-2"
              >
                <Wallet size={20} /> To'lovlar ro'yxati
              </Title>
              <Train_adv_paid id={adv?.id} />
            </div>
            {adv?.tolovlar?.length ? (
              <List
                bordered={false}
                dataSource={adv?.tolovlar}
                renderItem={(item) => {
                  // Dropdown menyusi
                  const menu = (
                    <Menu>
                      <Menu.Item key="delete">
                        <Popconfirm
                          title="Rostdan ham o‘chirmoqchimisiz?"
                          okText={isLoading ? "O'chirilmoqda" : "Ha"}
                          cancelText="Yo‘q"
                          onConfirm={() => onDelete(item.id)}
                        >
                          <div className="flex items-center gap-2 text-red-600 cursor-pointer">
                            <Trash2 size={16} />
                            <span>O‘chirish</span>
                          </div>
                        </Popconfirm>
                      </Menu.Item>
                    </Menu>
                  );

                  return (
                    <div className="flex justify-between text-lg bg-green-100/80 p-2 rounded-lg my-3 items-start relative">
                      {/* Chap qism */}
                      <div className="flex flex-col w-[75%]">
                        <p className="text-sm font-bold">
                          {formatDate(item?.created_at)}
                        </p>
                        <p className="text-xs break-words">{item?.comment}</p>
                      </div>

                      {/* Summa */}
                      <h2 className="text-base px-2 py-1 text-green-800 font-bold whitespace-nowrap">
                        +
                        {Number(item?.Shartnomasummasi).toLocaleString("uz-UZ")}{" "}
                        so'm
                      </h2>

                      <Dropdown
                        overlay={menu}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <button className="ml-2 text-gray-600 hover:text-gray-800">
                          <MoreHorizontal size={18} />
                        </button>
                      </Dropdown>
                    </div>
                  );
                }}
              >
                <p className="flex items-center gap-2 text-green-900 text-2xl">
                  <BanknoteArrowDown size={30} />
                  <span className="font-semibold">Jami to'lovlar:</span>
                  <span className="font-bold">
                    {Number(adv?.jami_tolov).toLocaleString("uz-UZ")} So'm
                  </span>
                </p>
              </List>
            ) : (
              <Empty description="Hozircha to'lovlar mavjud emas" />
            )}
          </Card>
        </div>
      </Card>
    </div>
  );
}

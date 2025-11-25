import {
  Card,
  Divider,
  List,
  Tag,
  Typography,
  Empty,
  Badge,
  Button,
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
} from "lucide-react";
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
export default function Train_Archive_Paid({ data }) {
  return (
    <div className="w-full mt-10 ">
      <Card className="rounded-2xl shadow-xl bg-white">
        <div className="flex items-center gap-3">
          <Badge color="green" />
          <Title level={2} className="text-green-800 font-bold">
            Reklama ma'lumotlari
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
                {data?.Egallagan_maydon} {data?.O_lchov_birligi}
              </p>

              <p className="flex items-center gap-2 text-green-900">
                <Wallet size={20} />
                <span className="font-semibold">Banner narxi:</span>
                <Tag color="green" className="text-base px-2 py-1">
                  {data?.Qurilma_narxi} so'm
                </Tag>
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <FileText size={20} />
                <span className="font-semibold">Shartnoma raqami:</span>
                {data?.Shartnoma_raqami}
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <Calendar size={20} />
                <span className="font-semibold">Yaratilgan sana:</span>
                {new Date(data?.created_at).toLocaleString("uz-UZ", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="flex items-center gap-2 text-green-900">
                <User size={20} />
                <span className="font-semibold">Yaratuvchi:</span>
                <Tag color="blue">{data?.user}</Tag>
              </p>
              <p className="flex items-center gap-2 text-green-900">
                <ImageUp size={20} />
                <span className="font-semibold">Reklama rasmi:</span>
                {data?.photo && (
                  <a
                    href={data.photo}
                    download="reklama_rasmi.jpg" // Fayl nomini xohlagancha qo'yish mumkin
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
                {data?.Shartnoma_fayl && (
                  <a
                    href={data.Shartnoma_fayl}
                    download="shartnoma.pdf" // Fayl nomini o'zingiz belgilashingiz mumkin
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
            </div>

            {data?.tolovlar?.length ? (
              <List
                bordered={false}
                dataSource={data?.tolovlar}
                renderItem={(item) => (
                  <div className="flex justify-between text-lg bg-green-100/80 p-2 rounded-lg my-3 mt-">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">
                        {formatDate(item?.created_at)}
                      </p>
                      <p className="text-xs break-words">{item?.comment}</p>
                    </div>
                    <h2 className="text-base px-2 py-1 text-green-800 font-bold">
                      +{Number(item?.Shartnomasummasi).toLocaleString("uz-UZ")}{" "}
                      so'm
                    </h2>
                  </div>
                )}
              >
                <p className="flex items-center gap-2 text-green-900 text-2xl">
                  <BanknoteArrowDown size={30} />
                  <span className="font-semibold">Jami to'lovlar:</span>
                  <p className="font-bold">
                    {Number(data?.jami_tolov).toLocaleString("uz-UZ")} So'm
                  </p>
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

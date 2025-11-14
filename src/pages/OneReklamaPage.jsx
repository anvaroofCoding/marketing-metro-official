import { Card, Divider, List, Tag, Typography, Empty, Badge } from "antd";
import {
  Calendar,
  DollarSign,
  FileText,
  User,
  Ruler,
  Phone,
  Wallet,
} from "lucide-react";

const { Title, Text } = Typography;

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

export default function ReklamaDetails({ data }) {
  const adv = data?.advertisement;

  return (
    <div className="w-full mt-10 ">
      <Card
        className="rounded-2xl shadow-xl bg-white"
        bodyStyle={{ padding: "30px" }}
      >
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
                {formatDate(adv?.created_at)}
              </p>

              <p className="flex items-center gap-2 text-green-900">
                <User size={20} />
                <span className="font-semibold">Yaratuvchi:</span>
                <Tag color="blue">{adv?.created_by}</Tag>
              </p>
            </div>
          </Card>

          {/* O'ng blok */}
          <Card className="rounded-xl shadow-md bg-green-50 border-none p-4">
            <Title
              level={4}
              className="text-green-900 mb-3 flex items-center gap-2"
            >
              <Wallet size={20} /> To'lovlar ro'yxati
            </Title>

            {adv?.tolovlar?.length ? (
              <List
                bordered={false}
                dataSource={adv?.tolovlar}
                renderItem={(item) => (
                  <List.Item className="flex justify-between text-lg">
                    <Text strong>{formatDate(item?.created_at)}</Text>
                    <Tag color="green" className="text-base px-2 py-1">
                      {item?.Shartnomasummasi} so'm
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Hozircha to'lovlar mavjud emas" />
            )}
          </Card>
        </div>
      </Card>
    </div>
  );
}

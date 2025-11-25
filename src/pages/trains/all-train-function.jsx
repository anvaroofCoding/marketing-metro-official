import { Tabs } from "antd";
import Depo from "../depo/depo";
import Tarkib from "../harakat-tarkibi/tarkib";
import AllAdvTrain from "../position_adv/allAdvTrain";
import Tarkib_Archive from "../tarkib-archive/tarkib_archive";

export default function TrainsTab() {
  const items = [
    {
      key: "1",
      label: "Harakat tarkibini ro'yxati",
      children: <Tarkib />,
    },
    {
      key: "2",
      label: "Depo ro'yxati",
      children: <Depo />,
    },

    {
      key: "4",
      label: "Poyezdagi barcha reklamalar",
      children: <AllAdvTrain />,
    },
    {
      key: "5",
      label: "Arxivlar",
      children: <Tarkib_Archive />,
    },
  ];

  return (
    <div className="w-full">
      <style>
        {`
          /* 🔥 TAB PANELNI UMUMIY YASHIL FON QILISH */
          .ant-tabs-nav {
            background: #155d27 !important; /* green-600 */
            border-radius: 8px !important;
            padding: 8px 12px !important;
          }
          .ant-tabs-nav::before {
            border-bottom: none !important; /* pastdagi chiziqni olib tashlaydi */
          }

          /* Tab nomlari */
          .ant-tabs-tab-btn {
            color: white !important; 
            font-weight: 600;
          }

          /* Hover */
          .ant-tabs-tab:hover .ant-tabs-tab-btn {
            color: #e0ffe8 !important;
          }

          /* Active tab text */
          .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #ffffff !important;
          }

          /* Active pastki chiziq */
          .ant-tabs-ink-bar {
            background: #ffffff !important; /* oq underline */
          }

        `}
      </style>

      <Tabs
        defaultActiveKey="1"
        items={items}
        tabBarGutter={30}
        size="large"
        animated
      />
    </div>
  );
}

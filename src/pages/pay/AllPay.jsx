import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Spin, Table } from "antd";
import Highlighter from "react-highlight-words";
import { useGettAllPaidQuery } from "@/services/api";
import dayjs from "dayjs";

const AllPay = () => {
  const { data, isLoading } = useGettAllPaidQuery();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        ?.includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Reklama nomi",
      dataIndex: "reklama",
      key: "reklama",
      width: "15%",
      ...getColumnSearchProps("reklama"),
    },
    {
      title: "Ijarachi",
      dataIndex: "ijarachi",
      key: "ijarachi",
      width: "15%",
      ...getColumnSearchProps("ijarachi"),
    },
    {
      title: "Joylashuvi",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (value) => (
        <span>{value == "station" ? "Bekatlar" : "Xarakat tarkiblari"}</span>
      ),
    },
    {
      title: "Summasi",
      dataIndex: "summa",
      key: "namsummae",
      width: "15%",
      render: (value) => (
        <span style={{ color: "green", fontWeight: 600 }}>
          +{value?.toLocaleString("uz-UZ")} so‘m
        </span>
      ),
    },
    {
      title: "To'langan sana",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Izoh",
      dataIndex: "comment",
      key: "comment",
      width: "15%",
      ...getColumnSearchProps("comment"),
    },
  ];
  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  return (
    <div>
      <div className="relative bg-gradient-to-r from-green-800 via-green-800 to-green-800 rounded-3xl border border-slate-200/20 p-8 mb-8 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-green-600/10 to-green-600/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10">
          <h1 className="font-bold text-4xl text-white animate-fade-in solid">
            Barcha to'lovlar jadvali
          </h1>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data?.payments}
        pagination={{
          pageSize: 25, // shu yerda limitni oshirasiz
        }}
      />
    </div>
  );
};
export default AllPay;

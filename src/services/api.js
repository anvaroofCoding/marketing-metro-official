import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://sunnat.tm1.uz/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token_marketing");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const status = result?.error?.status;
  if (status === 401 || status === 403) {
    window.location.replace("/error-403");
  }
  return result;
};
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Positions"],
  endpoints: (builder) => ({
    getStation: builder.query({
      query: (id) => `/stations/${id}/`,
      providesTags: ["Positions"],
    }),
    getPositionsByStation: builder.query({
      query: ({ stationId, page = 1, limit = 10, search = "" }) => {
        let url = `/positions/?station=${stationId}&page=${page}&limit=${limit}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        return url;
      },
      providesTags: ["Positions"],
    }),
    createPosition: builder.mutation({
      query: (body) => ({
        url: `/positions/`,
        method: "POST",
        body, // { station_id: 1, number: 9 }
      }),
      invalidatesTags: ["Positions"],
    }),
    updatePosition: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/positions/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Positions"],
    }),
    deletePosition: builder.mutation({
      query: (id) => ({
        url: `/positions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
    getAdvent: builder.query({
      query: () => "/advertisements/",
    }),
    createAdvent: builder.mutation({
      query: (formData) => ({
        url: "/advertisements/",
        method: "POST",
        body: formData,
        // MUHIM: headers ni qo'ymang, fetch avtomatik Content-Type ni o'rnatadi
      }),
      invalidatesTags: ["Positions"],
    }),
    updateAdvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advertisements/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Positions"], // queryni refetch qiladi
    }),
    deleteAdvent: builder.mutation({
      query: (id) => ({
        url: `/advertisements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
    postPdf: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("schema_image", file); // 🔑 backend kutilayotgan field nomi

        return {
          url: `/stations/${id}/update-image/`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    getArchive: builder.query({
      query: ({ page = 1, limit = 9, search = "" }) => ({
        url: `/advertisements-archive/`,
        params: { page, limit, search },
      }),
    }),
    getShowArchive: builder.query({
      query: (arxiver) => ({
        url: `/advertisements-archive/${arxiver}/`,
      }),
    }),
    getArchiveExcel: builder.query({
      query: () => ({
        url: "/advertisements/export-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getArchiveShowExcel: builder.query({
      query: () => ({
        url: "/advertisements-archive/export-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getTime: builder.query({
      query: ({ page = 1, limit = 9, search = "" }) => ({
        url: `/tugashi-advertisements/`,
        params: { page, limit, search },
      }),
    }),
    getTimeTugagan: builder.query({
      query: (id) => ({
        url: `/tugashi-advertisements/${id}/`,
      }),
    }),
    getTugaganExcel: builder.query({
      query: () => ({
        url: "tugashi-advertisements/export-expired-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getWeekExcel: builder.query({
      query: () => ({
        url: "tugashi-advertisements/export-week-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getDelays: builder.query({
      query: () => ({
        url: "tugashi-advertisements/",
      }),
    }),
    getSearchs: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/all-advertisements/",
        params: { page, limit, search },
      }),
    }),
    getSearchsId: builder.query({
      query: (ida) => ({
        url: `/all-advertisements/${ida}/`,
      }),
    }),
    getSearchExcel: builder.query({
      query: ({ search }) => ({
        url: "/all-advertisements/export-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
        params: { search },
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/me/",
      }),
    }),
    getNotive: builder.query({
      query: () => ({
        url: "/count/",
      }),
    }),
    getStatistikc: builder.query({
      query: () => ({
        url: "/advertisements/statistics/",
      }),
    }),
    getStatistikcPhotos: builder.query({
      query: () => ({
        url: "/advertisements/last-10-images/",
      }),
    }),
    getGeneralSearch: builder.query({
      query: () => ({
        url: "/advertisements/export-pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    GetArchivePdf: builder.query({
      query: () => ({
        url: "/advertisements-archive/export-pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getAuth: builder.query({
      query: () => ({
        url: "/auth/check/",
      }),
    }),
    getTashkilod: builder.query({
      query: ({ page, search, limit = 5 }) => ({
        url: `/ijarachilar/`,
        params: { page, search, limit },
      }),
      providesTags: ["tashkilod"],
    }),
    addTashkilod: builder.mutation({
      query: (formData) => ({
        url: `/ijarachilar/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["tashkilod"],
    }),
    updateTashkilod: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/ijarachilar/${id}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["tashkilod"],
    }),
    getShowTashkilod: builder.query({
      query: (id) => ({
        url: `/ijarachilar/${id}/`,
      }),
    }),
    getTashkilodExcel: builder.query({
      query: () => ({
        url: "/ijarachilar/export-excel",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    GetTashkilodPdf: builder.query({
      query: () => ({
        url: "/ijarachilar/export-pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getTashkilodoptions: builder.query({
      query: () => ({
        url: `/ijarachilar/`,
      }),
      providesTags: ["Positions"],
    }),
    getBanner: builder.query({
      query: ({ page, search, limit }) => ({
        url: `/turi/`,
        params: { page, search, limit },
      }),
      providesTags: ["Positions"],
    }),
    addBanner: builder.mutation({
      query: (formData) => ({
        url: `/turi/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/turi/${id}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getReklama: builder.query({
      query: (id) => ({
        url: `/positions/${id}`,
      }),
      providesTags: ["Positions"],
    }),
    getBannerForInput: builder.query({
      query: () => ({
        url: `/turi/`,
      }),
      providesTags: ["Positions"],
    }),
    getTashkilodByinput: builder.query({
      query: () => ({
        url: `/ijarachilar/`,
      }),
      providesTags: ["Positions"],
    }),
    addSum: builder.mutation({
      query: (formData) => ({
        url: `/shartnoma-summalari/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getAllAdvertimest: builder.query({
      query: () => ({
        url: `/advertisements/statistics-viewset/all`,
      }),
      providesTags: ["Positions"],
    }),
    getDepo: builder.query({
      query: () => ({
        url: `/depo/`,
      }),
      providesTags: ["Positions"],
    }),
    addDepo: builder.mutation({
      query: (formData) => ({
        url: `/depo/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    updateDepo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/depo/${id}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getTarkib: builder.query({
      query: ({ search, page, limit }) => ({
        url: `/tarkib/`,
        params: { search, page, limit },
      }),
      providesTags: ["Positions"],
    }),
    addTarkib: builder.mutation({
      query: (formData) => ({
        url: `/tarkib/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    updateTarkib: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tarkib/${id}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getTarkibPosition: builder.query({
      query: () => ({
        url: `/tarkib-position/`,
      }),
      providesTags: ["Positions"],
    }),
    addTarkibPosition: builder.mutation({
      query: (formData) => ({
        url: `/tarkib-position/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    updateTarkibPosition: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tarkib-position/${id}/`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getTarkibSelect: builder.query({
      query: () => ({
        url: `/tarkib/`,
      }),
      providesTags: ["Positions"],
    }),
    getTarkibDetails: builder.query({
      query: (id) => ({
        url: `/tarkib/${id}`,
      }),
      providesTags: ["Positions"],
    }),
    createTrainPositionAdv: builder.mutation({
      query: (formData) => ({
        url: "/tarkib-advertisement/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    getTarkibAdvertimesDetails: builder.query({
      query: (id) => ({
        url: `/tarkib-position/${id}`,
      }),
      providesTags: ["Positions"],
    }),
    addSumForTarkib: builder.mutation({
      query: (formData) => ({
        url: `/tarkib-shartnoma-summalari/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Positions"],
    }),
    updateTrainAdvertimies: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tarkib-advertisement/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Positions"],
    }),
    deleteAdventTrain: builder.mutation({
      query: (id) => ({
        url: `/tarkib-advertisement/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
    deleteAdventTrainPaid: builder.mutation({
      query: (id) => ({
        url: `/tarkib-shartnoma-summalari/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
    deleteAdventBekatPaid: builder.mutation({
      query: (id) => ({
        url: `/shartnoma-summalari/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
    getAllAdvTrain: builder.query({
      query: ({
        page,
        search,
        Ijarachi,
        position,
        position__harakat_tarkibi,
        limit,
      }) => ({
        url: `/tarkib-advertisement/`,
        params: {
          page,
          search,
          Ijarachi,
          position,
          position__harakat_tarkibi,
          limit,
        },
      }),
      providesTags: ["Positions"],
    }),
    getIjarachiOption: builder.query({
      query: () => ({
        url: `/ijarachilar/`,
      }),
      providesTags: ["Positions"],
    }),
    getPositionTrainOption: builder.query({
      query: () => ({
        url: `/tarkib-position/`,
      }),
      providesTags: ["Positions"],
    }),
    getTarkibTrainOption: builder.query({
      query: () => ({
        url: `/tarkib/`,
      }),
      providesTags: ["Positions"],
    }),
    getArchiveTrains: builder.query({
      query: ({ page, search, Ijarachi, position, tarkib, limit }) => ({
        url: `/tarkib-adv-archive/`,
        params: {
          page,
          search,
          Ijarachi,
          position,
          tarkib,
          limit,
        },
      }),
      providesTags: ["Positions"],
    }),
    getArchiveTrainsDetail: builder.query({
      query: ({ id }) => ({
        url: `/tarkib-adv-archive/${id}/`,
      }),
      providesTags: ["Positions"],
    }),
    getAllReklamaDepo: builder.query({
      query: ({ type }) => ({
        url: `/ijarachilar/unified-statistics/?type=${type}`,
      }),
      providesTags: ["Positions"],
    }),
    getPDfIjarachiSum: builder.query({
      query: () => ({
        url: "/ijarachilar/sum-statistics/pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getPDFDashMain: builder.query({
      query: ({ type }) => ({
        url: `/ijarachilar/unified-statistics/?type=${type}&pdf=true`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }), // bu summalarniki
    getPDFDashIjarachi: builder.query({
      query: () => ({
        url: "/ijarachi-tarkib-statistics/all-pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    gettAllPaid: builder.query({
      query: () => ({
        url: `/payments-history/`,
      }),
      providesTags: ["Positions"],
    }),
    getPDFallReklamaMain: builder.query({
      query: () => ({
        url: "/advertisements/statistics-viewset/all-pdf/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
  }),
});
export const {
  useGetPDFallReklamaMainQuery,
  useGettAllPaidQuery,
  useGetPDFDashIjarachiQuery,
  useGetPDFDashMainQuery,
  useGetPDfIjarachiSumQuery,
  useGetAllReklamaDepoQuery,
  useGetArchiveTrainsDetailQuery,
  useGetArchiveTrainsQuery,
  useGetTarkibTrainOptionQuery,
  useGetPositionTrainOptionQuery,
  useGetIjarachiOptionQuery,
  useGetAllAdvTrainQuery,
  useDeleteAdventBekatPaidMutation,
  useDeleteAdventTrainPaidMutation,
  useDeleteAdventTrainMutation,
  useUpdateTrainAdvertimiesMutation,
  useAddSumForTarkibMutation,
  useGetTarkibAdvertimesDetailsQuery,
  useCreateTrainPositionAdvMutation,
  useGetTarkibDetailsQuery,
  useGetTarkibSelectQuery,
  useGetTarkibPositionQuery,
  useAddTarkibPositionMutation,
  useUpdateTarkibPositionMutation,
  useGetTarkibQuery,
  useAddTarkibMutation,
  useUpdateTarkibMutation,
  useAddDepoMutation,
  useUpdateDepoMutation,
  useGetDepoQuery,
  useGetAllAdvertimestQuery,
  useAddSumMutation,
  useGetTashkilodByinputQuery,
  useGetBannerForInputQuery,
  useGetReklamaQuery,
  useUpdateBannerMutation,
  useAddBannerMutation,
  useGetBannerQuery,
  useGetTashkilodoptionsQuery,
  useGetTashkilodPdfQuery,
  useGetTashkilodExcelQuery,
  useGetShowTashkilodQuery,
  useUpdateTashkilodMutation,
  useAddTashkilodMutation,
  useGetTashkilodQuery,
  useGetAuthQuery,
  useGetArchivePdfQuery,
  useGetGeneralSearchQuery,
  useGetStatistikcPhotosQuery,
  useGetStatistikcQuery,
  useGetNotiveQuery,
  useGetMeQuery,
  useGetSearchExcelQuery,
  useGetSearchsIdQuery,
  useGetSearchsQuery,
  useGetDelaysQuery,
  useGetWeekExcelQuery,
  useGetTugaganExcelQuery,
  useGetTimeTugaganQuery,
  useGetTimeQuery,
  useGetArchiveShowExcelQuery,
  useGetArchiveExcelQuery,
  useGetShowArchiveQuery,
  useGetArchiveQuery,
  usePostPdfMutation,
  useCreateAdventMutation,
  useCreatePositionMutation,
  useGetStationQuery,
  useGetPositionsByStationQuery,
  useDeletePositionMutation,
  useUpdatePositionMutation,
  useGetAdventQuery,
  useUpdateAdventMutation,
  useDeleteAdventMutation,
} = api;

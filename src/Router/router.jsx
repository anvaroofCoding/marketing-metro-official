import App from "@/App";
import Login from "@/Auth/login";
import Error_403 from "@/components/Error_403";
import AboutProgram from "@/pages/about-program";
import Archive from "@/pages/archive";
import ShowArchive from "@/pages/archive-dails";
import Banner from "@/pages/banner";
import Dashboard from "@/pages/dashboard";
import Delay7 from "@/pages/delay7";
import DelayEnd from "@/pages/delayEnd";
import Depo from "@/pages/depo/depo";
import Allsearch from "@/pages/general_rek";
import GenerelSearchDETAILS from "@/pages/general_rekSearch";
import Tarkib_Details from "@/pages/harakat-tarkib-details/tarkib_details";
import Dash_All_Reklama from "@/pages/link/dash_all_reklama";
import Dash_Bekat from "@/pages/link/dash_bekat";
import Dash_Liniya from "@/pages/link/dash_liniya";
import Dash_Reklama from "@/pages/link/dash_reklama";
import Dash_turi from "@/pages/link/dash_turi";
import Map from "@/pages/map";
import Position_adv from "@/pages/position_adv/positions_adv";
import AdvertisementDetail from "@/pages/positions";
import StationDetail from "@/pages/station";
import Tarkib_archive_details from "@/pages/tarkib-archive/tarkib_archive_details";
import TashkilodDetails from "@/pages/tashkilodDetails";
import Tashkilot from "@/pages/tashkilot";
import TrainsTab from "@/pages/trains/all-train-function";
import Weekdaitail from "@/pages/weekDetails";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/tashkilotni-royxatga-olish", element: <Tashkilot /> },
      { path: "/archive/", element: <Archive /> },
      { path: "/delay7/", element: <Delay7 /> },
      { path: "/delaysEnd/", element: <DelayEnd /> },
      { path: "/map/", element: <Map /> },
      { path: "/dastur-haqida", element: <AboutProgram /> },
      { path: "/umumiy-qidiruv/", element: <Allsearch /> },
      { path: "/umumiy-qidiruv/:ida", element: <GenerelSearchDETAILS /> },
      { path: "/station/:id/", element: <StationDetail /> },
      {
        path: "/tashkilotni-royxatga-olish/:id",
        element: <TashkilodDetails />,
      },
      {
        path: "/station/:id/position/:ids/",
        element: <AdvertisementDetail />,
      },
      {
        path: "/archive/station/:id/position/:ids/:arxiver",
        element: <ShowArchive />,
      },
      {
        path: "/kechikishlar/:ida",
        element: <Weekdaitail />,
      },
      {
        path: "/Banner",
        element: <Banner />,
      },
      {
        path: "/All/advertisement/liniya",
        element: <Dash_Liniya />,
      },
      {
        path: "/All/advertisement/liniya/:liniya",
        element: <Dash_Bekat />,
      },
      {
        path: "/All/advertisement/liniya/:liniya/:bekat/",
        element: <Dash_turi />,
      },
      {
        path: "/All/advertisement/liniya/:liniya/:bekat/:turi",
        element: <Dash_Reklama />,
      },
      {
        path: "/All/advertisement/:ida",
        element: <Dash_All_Reklama />,
      },
      {
        path: "/deponi-royxatga-olish",
        element: <Depo />,
      },
      {
        path: "/train",
        element: <TrainsTab />,
      },
      {
        path: "/train/:id",
        element: <Tarkib_Details />,
      },
      {
        path: "/train/adver/:id",
        element: <Position_adv />,
      },
      {
        path: "/train/archive/:id",
        element: <Tarkib_archive_details />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  {
    path: "/error-403",
    element: <Error_403 />,
  },
]);

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "antd";

export default function Error_403() {
  return (
    <div className="grid grid-cols-2 w-full h-screen bg-[#2F4858] ">
      <div className=" flex justify-center items-center ">
        <DotLottieReact
          src="https://lottie.host/e56a7351-f2d3-43eb-8662-72e8a697c436/x8z0v8Og41.lottie"
          loop
          autoplay
        />
      </div>
      <div className=" flex flex-col justify-center items-center gap-6  px-30">
        <h1 className="text-9xl regular text-[#b3d89c]">403</h1>
        <h2 className="text-4xl text-white font-bold text-center">
          Token vaqti tugadi iltimos qayta kiriting!
        </h2>
        <p className="text-md text-white text-center">
          Token tekshiruvi siz login parolingizga qayta kirganingizdan so'ng 24
          soat saqlanada va yana qayta yangilanadi bu sizning akkauntingizni
          xavfsizligini saqlash uchun qilingan
        </p>
        <Button size="large" variant="solid" color="cyan" href="/login">
          Qayta kirish
        </Button>
      </div>
    </div>
  );
}

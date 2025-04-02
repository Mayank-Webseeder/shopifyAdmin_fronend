import React, { useEffect } from "react";
import Carousel from "./Carousel";

const LoginCarousel = () => {
  const image =
    "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const image2 =
    "https://images.unsplash.com/photo-1599908758979-25ba52737fb5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const image3 =
    "https://images.unsplash.com/photo-1455557412176-951a705225c5?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const slides = [
    {
      "image": image,
      "name": "Page Management",
      "text": "Create, edit, and organize pages to keep your content up to date."
    },
    {
      "image": image2,
      "name": "Homepage Customization",
      "text": "Design and manage your homepage with banners, sections, and featured content."
    },
    {
      "image": image3,
      "name": "Dashboard & KPIs",
      "text": "Monitor key metrics, track updates, and get insights at a glance."
    }
  ].map((data) => {
    return (
      <div className="h-screen w-full relative">
        <img
          src={data.image}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute px-8 py-24 top-0 left-0 h-full w-full flex flex-col justify-end items-start text-white bg-black/50 gap-4">
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <h2 className="max-w-xs">{data.text}</h2>
        </div>
      </div>
    );
  });

  useEffect(() => { }, []);

  return (
    <div className="w-full overflow-hidden flex flex-col justify-evenly items-center col-span-2">
      <div className="h-screen w-full loginpage relative">
        <Carousel data={slides} setnum={1} setmode="fadeout" />
      </div>
    </div>
  );
};

export default LoginCarousel;

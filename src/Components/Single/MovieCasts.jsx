import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { UsersData } from "../../Data/MovieData";
import Titles from "../Titles";

// Import styles nếu chưa có
import "swiper/css";

function MovieCasts() {
  return (
    <div className="my-12">
      <Titles title="Casts" Icon={FaUserFriends} />
      <div className="mt-10">
        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={1000}
          modules={[Autoplay]}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            480: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
        >
          {UsersData.map((user, i) => (
            <SwiperSlide key={i}>
              <div className="w-full p-3 text-center italic text-xs text-text rounded flex-colo bg-dry border border-border hover:scale-105 transition duration-300">
                <img
                  src={`/images/${user.image}`}
                  alt={user.fullName}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <p className="text-sm font-medium">{user?.fullName}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default MovieCasts;

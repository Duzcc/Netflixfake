import React from 'react';
import { FiUser } from 'react-icons/fi';

function Promos() {
  return (
    <div className="my-20 py-10 md:px-20 px-8 bg-dry rounded-lg shadow-lg">
      <div className="lg:grid lg:grid-cols-2 lg:gap-10 items-center">
        {/* Left: Text content */}
        <div className="flex lg:gap-10 gap-6 flex-col">
          <h1 className="xl:text-3xl text-2xl capitalize font-sans font-semibold xl:leading-relaxed text-white">
            Download Your Movies & Watch Offline. <br /> Enjoy on Your Mobile
          </h1>
          <p className="text-text text-sm xl:text-base leading-6 xl:leading-8 text-gray-300">
            Watch anywhere. Cancel anytime. Ready to watch? Stream on your phone, tablet, laptop, and TV without paying extra. Enjoy 4K and 2K resolution options for smooth viewing even offline.
          </p>
          <div className="flex gap-4 md:text-lg text-sm">
            <div className="flex-colo bg-black text-subMain px-6 py-3 rounded font-bold shadow-md">
              HD 4K
            </div>
            <div className="flex items-center gap-2 bg-black text-subMain px-6 py-3 rounded font-bold shadow-md">
              <FiUser /> 2K
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="mt-10 lg:mt-0">
          <img
            src="/images/mobile.png"
            alt="Mobile App"
            className="w-full object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Promos;

import React, { useState } from "react";
import MainModal from "./MainModal";
import { Input } from "../UsedInputs";
import Uploder from "../Uploder";

function CastsModal({ modalOpen, setModalOpen, cast }) {
  const [name, setName] = useState(cast?.fullName || "");
  const [image, setImage] = useState(cast?.image || "user.png");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fullName: name,
      image,
    };

    if (cast) {
      console.log("Updating cast:", payload);
      // updateCastAPI(cast.id, payload);
    } else {
      console.log("Creating cast:", payload);
      // createCastAPI(payload);
    }

    setModalOpen(false);
  };

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block sm:w-4/5 md:w-3/5 lg:w-2/5 w-full align-middle p-10 overflow-y-auto h-full bg-main text-white rounded-2xl border border-border">
        <h2 className="text-3xl font-bold">
          {cast ? "Update Cast" : "Create Cast"}
        </h2>

        <form className="flex flex-col gap-6 text-left mt-6" onSubmit={handleSubmit}>
          {/* Cast Name */}
          <Input
            label="Cast Name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            bg={false}
          />

          {/* Upload image */}
          <div className="flex flex-col gap-2">
            <p className="text-border font-semibold text-sm">Cast Image</p>
            <Uploder onUpload={(url) => setImage(url)} />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded">
              <img
                src={image.startsWith("http") ? image : `/images/${image}`}
                alt={name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex-rows gap-4 py-3 text-lg transitions hover:bg-dry border-2 border-subMain rounded bg-subMain text-white"
          >
            {cast ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </MainModal>
  );
}

export default CastsModal;

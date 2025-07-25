import React from "react";
import MainModal from "./MainModal";
import {
  FaFacebook,
  FaPinterest,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { MdEmail } from "react-icons/md";

function ShareMovieModal({ modalOpen, setModalOpen, movie }) {
  if (!movie) return null;

  const title = movie.title || movie.name || "Untitled Movie";

  const shareUrl = `${window.location.protocol}//${window.location.host}/movie/${movie.id}`;

  const shareData = [
    {
      icon: <FaFacebook />,
      Button: FacebookShareButton,
    },
    {
      icon: <FaTwitter />,
      Button: TwitterShareButton,
    },
    {
      icon: <FaTelegram />,
      Button: TelegramShareButton,
    },
    {
      icon: <FaWhatsapp />,
      Button: WhatsappShareButton,
    },
    {
      icon: <FaPinterest />,
      Button: PinterestShareButton,
    },
    {
      icon: <MdEmail />,
      Button: EmailShareButton,
    },
  ];

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block sm:w-4/5 border border-border md:w-3/5 lg:w-2/5 w-full align-middle p-10 overflow-y-auto h-full bg-main text-white rounded-2xl">
        <h2 className="text-2xl">
          Share <span className="text-xl font-bold">"{title}"</span>
        </h2>
        <div className="flex flex-wrap items-center gap-6 mt-6">
          {shareData.map(({ Button, icon }, index) => (
            <Button
              key={index}
              url={shareUrl}
              quote={`Watch "${title}" on Netflixo`}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded bg-white bg-opacity-30 text-lg hover:bg-subMain transition">
                {icon}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </MainModal>
  );
}

export default ShareMovieModal;

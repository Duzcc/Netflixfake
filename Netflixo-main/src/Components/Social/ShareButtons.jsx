import React from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from 'react-share';
import { FiLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

function ShareButtons({ movie, url }) {
    const shareUrl = url || window.location.href;
    const title = `Check out ${movie?.name || 'this movie'} on Netflixo!`;
    const description = movie?.desc || '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-text">Share:</span>

            <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={title} separator=" - ">
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <button
                onClick={copyToClipboard}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transitions"
                title="Copy link"
            >
                <FiLink className="text-white" />
            </button>
        </div>
    );
}

export default ShareButtons;

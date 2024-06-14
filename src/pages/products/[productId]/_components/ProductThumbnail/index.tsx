import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'

type ProductThumbnailProps = {
  imageUrls?: string[];
}

const ProductThumbnail = ({ imageUrls = [""] }: ProductThumbnailProps) => {
  return (
    <Carousel
      infiniteLoop
      showThumbs={false}
      showStatus={false}
    >
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={""} className='w-96 h-96' />
      ))}
    </Carousel>
  );
};

export default ProductThumbnail;

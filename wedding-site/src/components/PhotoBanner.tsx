import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import "./PhotoBanner.css";

const posMap: Record<string, string> = {
  'cincyPark.jpg': '30% center',
  'IMG_9285.jpeg': '60% center',
  'IMG_2070.jpeg': '10% center',
  'edoras.jpeg': '30% center',
  'IMG_9149.jpeg': '40% center',
  'lakeRocks.jpeg': '25% center',
  'cow.jpg': 'center center',
  'cruise.jpeg': 'center center',
  'cincyWall.jpeg': 'center center',
  'timesSquare.jpg': '39% center',
  'rockefeller.jpg': 'center center',
  'pyramid.jpg': '30% center',
  'cincyLake.jpg': '30% center',
  'chicago.jpg': '60% center',
};

const imageFiles: Record<string, { default: string }> = import.meta.glob('../assets/photoBanner/*.{jpeg,jpg}', { eager: true });

const photos = Object.entries(imageFiles).map(([path, module]) => {
    const filename = path.split('/').pop() ?? '';
    return {
        src: module.default,
        pos: posMap[filename] || 'center'
    }
});

export default function PhotoBanner() {
  return (
    <section className="photo-banner">
      <div className="photo-banner__label"></div>
        <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            spaceBetween={10}
            className="photo-banner__swiper"
        >
            {photos.map((photo, index) => (
                <SwiperSlide key={index} className="photo-banner__slide">
                    <img
                        src={photo.src}
                        style={{ objectPosition: photo.pos }}
                        alt=""
                        draggable={false}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    </section>
  );
}

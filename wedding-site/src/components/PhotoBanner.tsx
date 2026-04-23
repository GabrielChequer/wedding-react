import { useState, useRef, useCallback } from "react";
import "./PhotoBanner.css";

import cincyPark from "../assets/photoBanner/cincyPark.jpg";
import bagEnd from "../assets/photoBanner/IMG_9285.jpeg";
import edSheeranConcert from "../assets/photoBanner/IMG_2070.jpeg";
import edoras from "../assets/photoBanner/edoras.jpeg";
import teaPlace from "../assets/photoBanner/IMG_9149.jpeg";
import lakeRocks from "../assets/photoBanner/lakeRocks.jpeg";
import cow from "../assets/photoBanner/cow.jpg";
import cruise from "../assets/photoBanner/cruise.jpeg";
import cincyWall from "../assets/photoBanner/cincyWall.jpeg";
import timesSquare from "../assets/photoBanner/timesSquare.jpg";
import rockefeller from "../assets/photoBanner/rockefeller.jpg";
import pyramid from "../assets/photoBanner/pyramid.jpg";
import cincyLake from "../assets/photoBanner/cincyLake.jpg";
import chicago from "../assets/photoBanner/chicago.jpg";

const photos = [
  { src: cincyPark, pos: "30% center" },
  { src: bagEnd, pos: "60% center" },
  { src: edSheeranConcert, pos: "10% center" },
  { src: edoras, pos: "30% center" },
  { src: teaPlace, pos: "40% center" },
  { src: lakeRocks, pos: "25% center" },
  { src: cow, pos: "center center" },
  { src: cruise, pos: "center center" },
  { src: cincyWall, pos: "center center" },
  { src: timesSquare, pos: "39% center" },
  { src: rockefeller, pos: "center center" },
  { src: pyramid, pos: "30% center" },
  { src: cincyLake, pos: "30% center" },
  { src: chicago, pos: "60% center" },
];

const DRAG_THRESHOLD = 50;

export default function PhotoBanner() {
  const [current, setCurrent] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDragDelta(e.clientX - dragStart.current);
  };

  const onPointerUp = () => {
    if (dragStart.current !== null) {
      if (dragDelta < -DRAG_THRESHOLD) next();
      else if (dragDelta > DRAG_THRESHOLD) prev();
    }
    dragStart.current = null;
    setDragDelta(0);
    setIsDragging(false);
  };

  const getIndex = (offset: number) =>
    (current + offset + photos.length) % photos.length;

  return (
    <section className="photo-banner">
      <div className="photo-banner__label"></div>

      <div
        className={`photo-banner__track${isDragging ? " photo-banner__track--dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Far left – barely visible */}
        <div className="photo-banner__slide photo-banner__slide--far-left">
          <img
            src={photos[getIndex(-2)].src}
            style={{ objectPosition: photos[getIndex(-2)].pos }}
            alt=""
            draggable={false}
          />
        </div>

        {/* Left */}
        <div
          className="photo-banner__slide photo-banner__slide--left"
          style={{ transform: `translateX(${dragDelta * 0.3}px)` }}
        >
          <img
            src={photos[getIndex(-1)].src}
            style={{ objectPosition: photos[getIndex(-1)].pos }}
            alt=""
            draggable={false}
          />
        </div>

        {/* Center – hero */}
        <div
          className="photo-banner__slide photo-banner__slide--center"
          style={{ transform: `translateX(${dragDelta * 0.6}px)` }}
        >
          <img
            src={photos[current].src}
            style={{ objectPosition: photos[current].pos }}
            alt=""
            draggable={false}
          />
        </div>

        {/* Right */}
        <div
          className="photo-banner__slide photo-banner__slide--right"
          style={{ transform: `translateX(${dragDelta * 0.3}px)` }}
        >
          <img
            src={photos[getIndex(1)].src}
            style={{ objectPosition: photos[getIndex(1)].pos }}
            alt=""
            draggable={false}
          />
        </div>

        {/* Far right – barely visible */}
        <div className="photo-banner__slide photo-banner__slide--far-right">
          <img
            src={photos[getIndex(2)].src}
            style={{ objectPosition: photos[getIndex(2)].pos }}
            alt=""
            draggable={false}
          />
        </div>
      </div>

      <div className="photo-banner__controls">
        <button
          className="photo-banner__arrow"
          onClick={prev}
          aria-label="Previous photo"
        >
          ←
        </button>
        <div className="photo-banner__dots">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`photo-banner__dot${i === current ? " photo-banner__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="photo-banner__arrow"
          onClick={next}
          aria-label="Next photo"
        >
          →
        </button>
      </div>
    </section>
  );
}

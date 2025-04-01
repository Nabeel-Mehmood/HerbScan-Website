import React, { useState } from 'react';
import './home.css';
import './header.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import { register } from 'swiper/element';
import Header from '../Component/header'; 
import Footer from '../Component/footer'; 

// Images for the slider
import image1 from '../Assets/image1.jpg';
import image2 from '../Assets/image2.jpg';
import image3 from '../Assets/image3.jpg';
import image4 from '../Assets/image4.jpg';
import image5 from '../Assets/image5.jpg';

register();

function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        alert("Unsupported file format. Please upload a JPG or PNG image.");
        return;
      }
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        alert("Unsupported file format. Please upload a JPG or PNG image.");
        return;
      }
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setImageName("");
  };

  return (
    <div className="home-container">
      <Header showSearchBar={true} />
      <div className="upload-section">
        <div
          className="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ border: uploadedImage ? 'none' : '2px dashed #ccc' }}
        >
          {!uploadedImage && (
            <>
              <label htmlFor="file-upload-input" className="upload-label">
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                Drag & Drop your file here or <span>Browse</span>
              </label>
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <p className="upload-note">Supported formats: JPG, PNG</p>
            </>
          )}

          {uploadedImage && (
            <div className="uploaded-image-container">
              <img
                src={uploadedImage}
                alt={`Uploaded preview of ${imageName}`}
                className="uploaded-image"
              />
              <div className="buttons-container">
                <button
                  className="identify-btn"
                  onClick={() => alert(`Identifying: ${imageName}`)}
                >
                  Identify
                </button>
                <button className="remove-btn" onClick={handleRemove}>
                  Remove
                </button>
              </div>
              <p className="image-name">Image Name: {imageName}</p>
            </div>
          )}
        </div>
      </div>
      <div className="info-slider-section content-section">
        <div className="website-info">
          <h2>About HerbScan</h2>
          <p>
            HerbScan helps you identify different trees by uploading images. Use our powerful tool to learn more about the flora around you.
          </p>
        </div>
        <div className="image-slider">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
          >
            <SwiperSlide>
              <div className="slide-container">
                <img src={image1} alt="Slide 1" />
                <div className="caption">Caption for Slide 1</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-container">
                <img src={image2} alt="Slide 2" />
                <div className="caption">Caption for Slide 2</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-container">
                <img src={image3} alt="Slide 3" />
                <div className="caption">Caption for Slide 3</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-container">
                <img src={image4} alt="Slide 4" />
                <div className="caption">Caption for Slide 4</div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="slide-container">
                <img src={image5} alt="Slide 5" />
                <div className="caption">Caption for Slide 5</div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
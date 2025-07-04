import React from 'react'

const Gallery = ({ images }) => {
    return (
        <div className="gallery">
            {images &&
                images.map((image, index) => (
                    <div key={image}>
                        <img src={image} alt="Generated screenshot" className="galleryScreenshot"/>
                    </div>
                ))}
        </div>
    )
}

export default Gallery
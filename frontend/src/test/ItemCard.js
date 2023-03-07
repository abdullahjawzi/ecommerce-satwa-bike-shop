import React from 'react'
import {useNavigate} from 'react-router-dom';

import {MdArrowForward} from 'react-icons/md';

import './itemcard.css'

const ItemCard = ({product}) => {

    const navigate = useNavigate();
    
  return (
    <div className="card__main_contaner mb-5">
        <div className="card__photo__container">
            <img src={product.images[0].url} alt={product.images[0].fileName} />
        </div>

        <div className="card__details__container">
            <div className="card__item__title">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
            </div>

            <div className="card__item__prize">
                <p>Price</p>
                <div>
                    <h5>${product.price.toFixed(2)}</h5>
                    <p>$650.25</p>
                </div>
                
            </div>

            <div className="card_item_color">
                <p>Available colors</p>
                <div className="color_span__container">
                    {Object.entries(product.colorVariation).map(item => (
                        <span key={item[0]} style={{backgroundColor: item[0]}}></span>
                    ))}
                    {/* <span className='color1'></span>
                    <span className='color2'></span>
                    <span className='color3'></span>
                    <span className='color4'></span> */}
                </div>
            </div>

            <div className='pt-4 d-flex align-items-center justify-content-center w-100'>
                <button className='card__item_viewmore-btn' onClick={() => navigate(`/dash/product/${product._id}`)} >View More <MdArrowForward /></button>
            </div>
        </div>
    </div>
  )
}

export default ItemCard;

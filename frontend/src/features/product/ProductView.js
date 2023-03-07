import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useDispatch} from 'react-redux';
import {addItemToCart} from '../../app/cart/cartSlice';

import { Slide } from 'react-slideshow-image';
import {Row, Col} from 'react-bootstrap';
import {toast} from 'react-toastify';

import 'react-slideshow-image/dist/styles.css'
import '../../styles/employee_management/employeeList.css';
import '../../styles/productView.css';

const ProductView = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const {id} = useParams();
    
    const [product, setProduct] = useState(null);
    const [colorSelected, setColorSelected] = useState('');
    const [quantitySelected, setQuantitySelected] = useState('');

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axiosPrivate.get(`/api/products/${id}`);
                setProduct(response.data.product);
                setColorSelected(Object.entries(response.data.product.colorVariation)[0][0]);
            } catch (err) {
                toast.error(err.response.data?.message);
                navigate(-1);
            }
        }
        getProduct();
    }, [axiosPrivate, navigate, id]);

    console.log(product);

    const indicators = i => (
        <div className="indicator">
            <img src={product.images[i].url} alt={product.images[i].fileName} />
        </div>
    )

    const handleColorSelection = color => {
        if(colorSelected === color) {
            return;
        }
        setColorSelected(color);
        setQuantitySelected('');
    }

    const handleAddToCart = () => {
        if(!quantitySelected) {
            toast.error('Please select quantity');
            return;
        }

        const newItem = {
            _id: product._id,
            color: colorSelected,
            qty: quantitySelected
        }

        console.log(newItem);
        dispatch(addItemToCart(newItem));
        toast.success('Item added to the cart');
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1><span className='text-warning'>{product?.title}</span> Details</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            {product && (
                <Row>

                    <Col md={6}>
                        <div className='productView-slider-container'>
                            <Slide indicators={indicators} duration={5000} transitionDuration={500}>
                                {product?.images.map((slideImage)=> (
                                    <div className="each-slide" key={slideImage.fileName}>
                                        <div>
                                            <img className="each-slide-image" src={slideImage.url} alt="sample" />
                                        </div>
                                    </div>
                                ))} 
                            </Slide>
                        </div>
                    </Col>

                    <Col md={6}>
                        <h1 className='productView-title'>{product.title}</h1>
                        <h4 className='productView-price'>$ {product.price.toFixed(2)}</h4>
                        <p className='productView-description text-secondary'>{product.description}</p>
                        <div className='productView-condition'>
                            <label className='text-secondary'>Condition : </label>
                            <span className={product.condition === 'new' ? 'bg-success' : 'bg-warning'}>{product.condition === 'new' ? 'Brand New' : 'Already Used'}</span>
                        </div>
                        <div className='productView-colors-container'>
                            <label className='text-secondary'>Available colors</label>
                            <div className='productView-colors'>
                                {Object.entries(product.colorVariation).map(item => (
                                    <button 
                                        key={item[0]} 
                                        style={{backgroundColor: item[0]}} 
                                        className={colorSelected === item[0] ? 'productView-color-active' : ''}
                                        onClick={() => handleColorSelection(item[0])} 
                                    >
                                        
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='productView-quantity'>
                            <label className='text-secondary'>Available Quantity of the color selected</label>
                            {product.colorVariation[colorSelected] <= 0 ? (
                                <span>Out of stock</span>
                            ) : (
                                <select value={quantitySelected} onChange={e => setQuantitySelected(e.target.value)}>
                                    <option value=''>--select quantity--</option>
                                    {Array.from({length: product.colorVariation[colorSelected]}).map((i, index) => (
                                        <option key={index} value={index + 1}>{index + 1}</option>
                                    ))}
                                </select>
                            )}
                            
                        </div>

                        <button className='btn btn-dark my-4' onClick={handleAddToCart}>
                            Add To Cart
                        </button>
                    </Col>

                </Row>
            )}
            
        
        </div>
    );
}

export default ProductView;
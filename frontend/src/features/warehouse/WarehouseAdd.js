import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';
import ImageUploading from "react-images-uploading";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFirestorage from '../../hooks/useFirestorage';

import {MdModeEditOutline, MdDeleteForever, MdOutlineAddCircleOutline, MdDeleteSweep} from 'react-icons/md';
import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeAdd.css';
import '../../styles/warehouse_management/warehouseAdd.css';

const WarehouseAdd = () => {

    const navigate = useNavigate();
    const {roles} = useSelector(selectAuthUser);

    const axiosPrivate = useAxiosPrivate();
    
    const {uploading, upload} = useFirestorage();

    const [loading, setLoading] = useState(false);

    
    const [suppliers, setSuppliers] = useState([]);

    
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('new');
    const [state, setState] = useState('warehouse');
    const [colorQty, setColorQty] = useState({
        yellow: 0,
        red: 0,
        green: 0,
        black: 0
    })
    const [supplier, setSupplier] = useState('');
    
    useEffect(() => {
        const getAllSuppliers = async () => {
            try {
                const response = await axiosPrivate.get('/api/suppliers');
                setSuppliers(response.data.suppliers);
                setSupplier(response.data.suppliers[0]._id);
            } catch (err) {
                console.log(err);
            }
        }

        getAllSuppliers();
    }, [axiosPrivate])

    const maxNumber = 4;
    const onChange = (imageList, addUpdateIndex) => {
        
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);
        if(images.length !== 4) {
            toast.error('4 images required');
            setLoading(false);
            return;
        }

        const colorVariation = {};
        let totalQty = 0;

        for(let key in colorQty) {
            if(+colorQty[key] > 0) {
                colorVariation[key] = +colorQty[key];
                totalQty += +colorQty[key];
            }
        }
        const newProduct = {
            title: title.trim(),
            description: description.trim(),
            price: +price,
            condition,
            state,
            colorVariation,
            supplier,
            imageCount: images.length
        }

        if(
            !newProduct.title ||
            !newProduct.description ||
            newProduct.price <= 0 ||
            !newProduct.condition ||
            !newProduct.state ||
            !newProduct.supplier
        ) {
            console.log(newProduct);
            toast.error('All fields are required');
            setLoading(false);
            return;
        }

        
        if(totalQty <= 0) {
            toast.error('Product quantity is empty');
            setLoading(false);
            return;
        }

        
        try {
            const response = await axiosPrivate.post('/api/products', JSON.stringify(newProduct), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            const imageUrls = await upload(images, response.data.product._id);

            await axiosPrivate.put(`/api/products/${response.data.product._id}/images`, JSON.stringify({images: imageUrls}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            toast.success('Product Created Successfully');
            setLoading(false);
            setImages([]);
            setTitle('');
            setDescription('');
            setPrice(0);
            setCondition('new');
            setState('warehouse');
            setColorQty({
                yellow: 0,
                red: 0,
                green: 0,
                black: 0
            })
            setSupplier('');

        } catch (err) {
            console.log(err);
            toast.error('Product creation failed, try again');
            setLoading(false);
        }
    }

  
    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>Add New Product</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <form className='mb-5' onSubmit={handleSubmit}>

                <div className='warehouseAdd-product-images-wrapper'>
                    <p className='mb-4 warehouseAdd-product-images-label'>Product Images <small>(Maximum 4 images are allowed ,only jpeg format allowed)</small></p>

                    <ImageUploading
                        multiple
                        value={images}
                        onChange={onChange}
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                        acceptType={["jpg"]}
                    >
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                            errors
                            }) => (
                            
                            <>
                            
                            <div className="warehouseAdd-product-images-container">

                                <div className="warehouseAdd-product-images-left">
                                    <button
                                        type='button'
                                        style={isDragging ? { color: "red" } : null}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        <MdOutlineAddCircleOutline />
                                        <span>Click or Drag Images</span>
                                    </button>
                                    <button type='button' onClick={onImageRemoveAll}><MdDeleteSweep /> <span>Remove All</span></button>
                                </div>

                                <div className="warehouseAdd-product-images-right">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img src={image.data_url} alt="" width="100%" height="100%" />
                                            <div className="image-item__btn-wrapper">
                                                <button type='button' onClick={() => onImageUpdate(index)}><MdModeEditOutline /></button>
                                                <button type='button' onClick={() => onImageRemove(index)}><MdDeleteForever /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>    

                            </div>
                            {errors && errors.maxNumber && <span className='text-danger mt-2 warehouseAdd-product-images-error'>Only 4 jpeg images are allowed</span>}
                            </>           
                        )}
                    </ImageUploading>
                    
                </div>  

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product Title</label>
                        <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                </div>   

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className='p-4'></textarea>
                    </div>
                </div>  

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product Price in us dollars($) (per unit)</label>
                        <input type='number' step='.01' min='1' value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                </div>    

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product Condition</label>
                        <select value={condition} onChange={e => setCondition(e.target.value)}>
                            <option value="new">Brand New</option>
                            <option value="used">Already Used</option>
                        </select>
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product State</label>
                        <select value={state} onChange={e => setState(e.target.value)}>
                            <option value="warehouse">Transfer to warehouse</option>
                            {roles.indexOf('Admin') !== -1 && (<option value="showroom">Transfer to showroom</option>)}
                        </select>
                    </div>
                </div>

                <div className='warehouseAdd-product-quantities'>
                    <label>Product Quantities</label>
                    <div className='warehouseAdd-product-quatity'>
                        <span className='warehouseAdd-product-quatity-color1'></span>
                        <div>
                            <small>Yellow Color Quantity</small>
                            <input type='number' step='1' min='0' name="yellow" value={colorQty.yellow} onChange={e => setColorQty(prev => ({...prev, [e.target.name]: e.target.value}))} />
                        </div>
                    </div>
                    <div className='warehouseAdd-product-quatity'>
                        <span className='warehouseAdd-product-quatity-color2'></span>
                        <div>
                            <small>Red Color Quantity</small>
                            <input type='number' step='1' min='0' name="red" value={colorQty.red} onChange={e => setColorQty(prev => ({...prev, [e.target.name]: e.target.value}))} />
                        </div>
                    </div>
                    <div className='warehouseAdd-product-quatity'>
                        <span className='warehouseAdd-product-quatity-color3'></span>
                        <div>
                            <small>Green Color Quantity</small>
                            <input type='number' step='1' min='0' name="green" value={colorQty.green} onChange={e => setColorQty(prev => ({...prev, [e.target.name]: e.target.value}))} />
                        </div>
                    </div>
                    <div className='warehouseAdd-product-quatity'>
                        <span className='warehouseAdd-product-quatity-color4'></span>
                        <div>
                            <small>Black Color Quantity</small>
                            <input type='number' step='1' min='0' name="black" value={colorQty.black} onChange={e => setColorQty(prev => ({...prev, [e.target.name]: e.target.value}))} />
                        </div>
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Product Supplier</label>
                        <select value={supplier} onChange={e => setSupplier(e.target.value)}>
                            <option value=''>--Select a supplier--</option>
                            {suppliers.length > 0 && suppliers.map(s => (
                                <option value={s._id} key={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type='submit' className='btn btn-dark' disabled={loading}>{(loading && uploading) ? 'Product images uploading...' : loading ? 'Product Creating...' : 'Add Product'}</button>

            </form>

        </div>
    );
}

export default WarehouseAdd;
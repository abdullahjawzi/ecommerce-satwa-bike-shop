import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Table} from 'react-bootstrap';
import {MdAddBusiness} from 'react-icons/md';
import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeList.css';
import '../../styles/warehouse_management/warehouseList.css';

const WarehouseList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axiosPrivate.get('/api/products');
                setProducts(response.data.products);
            } catch (err) {
                console.log(err);
            }
        }
        getAllProducts();
    }, [axiosPrivate]);

    const handleSwitchProductState = async (productId, currentState, newState) => {
        if(currentState === newState) return;

        try {
            await axiosPrivate.put(`/api/products/${productId}/switch/state`, JSON.stringify({state: newState}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            const updatedProducts = products.map(p => {
                if(p._id === productId) {
                    return {
                        ...p,
                        state: newState
                    }
                }
                return p;
            })

            setProducts(updatedProducts);
            toast.success('Product state changed');
        } catch(err) {
            console.log(err);
            toast.error('Cannot update product state, try again');
        }
    }


    const getAvailableQuantities = (colorVariation) => {
        const availables = [];
        for(let key in colorVariation) {
            const i = (
                <li key={key}>
                    <span style={{backgroundColor: key}}></span>
                    <p>{colorVariation[key]} available</p>
                </li>
            )
            availables.push(i)
        }
        return availables;
    }

    const handleProductDelete = async id => {
        const isConfirmed = window.confirm(`Are You sure that you want to delete this product (${id})?`);

        if(isConfirmed) {
            
            try {
                await axiosPrivate.delete(`/api/products/${id}`);
                toast.success('Product deleted successfully');
                
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Warehouse Management</h1>
                <button className='btn btn-primary' onClick={() => navigate('/dash/warehouse-management/add')}>Add Product To Warehouse <MdAddBusiness /></button>
            </aside>

            <hr></hr>

            {products.length > 0 && (
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr>
                                <th>#Product ID</th>
                                <th>Title</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Unit Price in USD($)</th>
                                <th>State</th>
                                <th>Condition</th>
                                <th>Available Quantities</th>
                                <th>Supplier</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td><p className='warehouseList-row-item'>{p.productId}</p></td>
                                    <td><p className='warehouseList-row-item'>{p.title}</p></td>
                                    <td>
                                        <div className='warehouseList-row-image'>
                                            <img src={p.images[0].url} alt='product-item' />
                                        </div>
                                    </td>
                                    <td><p className='warehouseList-row-description'>{p.description}</p></td>
                                    <td><p className='warehouseList-row-item'>$ {p.price}</p></td>
                                    <td>
                                        <p className='warehouseList-row-item'>
                                            <select defaultValue={p.state} onChange={e => handleSwitchProductState(p._id, p.state, e.target.value)}>
                                                <option value='warehouse'>Warehouse</option>
                                                <option value='showroom'>Showroom</option>
                                            </select>
                                        </p>
                                    </td>
                                    <td><p className='warehouseList-row-item'>{p.condition === 'new' ? 'Brand New' : 'Used'}</p></td>
                                    
                                    <td>
                                        <ul className='warehouseList-row-availables'>
                                            {getAvailableQuantities(p.colorVariation)}
                                        </ul>
                                    </td>
                                    <td><p className='warehouseList-row-item'>{p.supplier?.name}</p></td>
                                    <td>
                                        <div className='warehouseList-row-actions'>
                                            <button className='btn btn-primary btn-sm' onClick={() => navigate(`/dash/product/${p._id}`)}>View</button>
                                            <button className='btn btn-success btn-sm' onClick={() => navigate(`/dash/warehouse-management/update?id=${p._id}`)}>Update</button>
                                            <button className='btn btn-danger btn-sm' onClick={() => handleProductDelete(p._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
            )}

        </div>
    );
}

export default WarehouseList;
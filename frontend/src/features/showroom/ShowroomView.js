import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import ItemCard from '../../test/ItemCard';

import '../../styles/employee_management/employeeList.css';

const ShowroomView = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getAllShowroomProducts = async () => {
            try {
                const response = await axiosPrivate.get('/api/products/showroom');
                setProducts(response.data.products);
            } catch (err) {
                console.log(err);
                navigate('/dash');
            }
        }
        getAllShowroomProducts();
    }, [axiosPrivate, navigate]);

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Welcome To Showroom</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <div className='showroomView-items-container d-flex align-items-center flex-wrap gap-4  p-5'>
                {products.length > 0 && products.map(p => (
                    <ItemCard key={p._id} product={p} />
                ))}
            </div>

        </div>
    );
}

export default ShowroomView;
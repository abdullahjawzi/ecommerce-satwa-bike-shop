import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useSelector} from 'react-redux';
import {selectAuthUser} from '../../app/auth/authSlice';

import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeAdd.css';


const MySalesAdd = () => {

    const {roles} = useSelector(selectAuthUser);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [searchParams] = useSearchParams();

    const isEdit = searchParams.get('edit') === 'true' ? searchParams.get('edit') : null;
    const id = searchParams.get('id') || null;

    const [customers, setCustomers] = useState([]);

    
    const [customer, setCustomer] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0.00);
    const [status, setStatus] = useState('pending');
    const [employeeId, setEmployeeId] = useState('');

    useEffect(() => {
        const getAllCustomers = async () => {
            try {
                const response = await axiosPrivate.get('/api/users/manage/customer');
                setCustomers(response.data.customers);
            } catch (err) {
                console.log(err);
            }
        }

        getAllCustomers();
    }, [axiosPrivate]);

    useEffect(() => {

        if(isEdit && isEdit === 'true' && id) {
            const getOrder = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/orders/inplace/${id}`)
                    const {order} = response.data;

                    setCustomer(order.customer);
                    setDescription(order.inplaceOrder?.description);
                    setPrice(order.inplaceOrder?.price);
                    setStatus(order.inplaceOrder?.status);
                    setEmployeeId(order.inplaceOrder?.handledBy);
                } catch (err) {
                    console.log(err);
                    toast.error(err.response.data?.message);
                    navigate('/dash/employee/sales-management');
                }
            }
            getOrder();
        } 

    }, [isEdit, id, axiosPrivate, navigate])

    const handleSubmit = async e => {
        e.preventDefault();

        const newOrder = {
            customer: customer.trim(),
            description: description.trim(),
            price: +price,
            status
        }

        if(!newOrder.customer || !newOrder.description || newOrder.price <= 0 || !newOrder.status) {
            toast.error('All fields are requried');
            return;
        }

        if(isEdit && isEdit === 'true' && id) {
            
            try {
                await axiosPrivate.put(`/api/orders/inplace/${id}`, JSON.stringify(newOrder), {
                    headers: {'Content-Type': 'application/json'}
                })

                setCustomer('');
                setDescription('');
                setPrice(0.00);
                setStatus('pending');

                toast.success('Inplace order updated');
                const to = roles.indexOf('Admin') === -1 ? '/dash/employee/sales-management' : `/dash/admin/employee-management/sales/${employeeId}`;
                navigate(to);
            } catch (err) {
                toast.error(err.response.data?.message);
            }
            
        } else {

            
            try {
                await axiosPrivate.post('/api/orders/inplace', JSON.stringify(newOrder), {
                    headers: {'Content-Type': 'application/json'}
                });

                toast.success('Inplace order created');
                setCustomer('');
                setDescription('');
                setPrice(0.00);
                setStatus('pending');
            } catch (err) {
                console.log(err);
                toast.error(err.response.data?.message)
            }
        }

        
    }

    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Inpalce Order' : 'Add New Inplace Order'}</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            </aside>

            <hr></hr>

            <form className='employeeAdd-form' onSubmit={handleSubmit}>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Select customer</label>
                        <select value={customer} onChange={e => setCustomer(e.target.value)}>
                            <option value=''>--select customer--</option>
                            {customers.map(c => (
                                <option key={c._id} value={c._id} >{c.userId} - {c.username}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Detailed description about the issue</label>
                        <textarea rows={10} className='p-4' value={description} onChange={e => setDescription(e.target.value)} ></textarea>
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Order Price ($)</label>
                        <input type='number' step='.01' min='1' value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Order Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value='pending'>Pending</option>
                            <option value='completed'>Completed</option>
                        </select>
                    </div>
                </div>

                <button className='btn btn-dark'>{isEdit === 'true' ? 'Update Order' : 'Create Order'}</button>

            </form>
        </div>
    );
}

export default MySalesAdd;
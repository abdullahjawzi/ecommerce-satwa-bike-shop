import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {toast} from 'react-toastify';

import '../../styles/employee_management/employeeAdd.css';

const SupplierAdd = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();

    const isEdit = searchParams.get('edit');
    const id = searchParams.get('id');

    
    const [supplier, setSupplier] = useState({});

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if(isEdit === 'true' && id) {
            const getSupplier = async () => {
                try {
                    const response = await axiosPrivate.get(`/api/suppliers/${id}`);
                    setSupplier(response.data.supplier);
                    setName(response.data.supplier?.name);
                    setEmail(response.data.supplier?.email);
                    setPhone(response.data.supplier?.phone);
                } catch (err) {
                    console.log(err);
                    navigate('/dash/admin/supplier-management');
                }
            }
            getSupplier();
        }
    }, [navigate, axiosPrivate, id, isEdit]);

    const handleSubmit = async e => {
        e.preventDefault();

        if(!name.trim() || !email.trim() || !phone.trim()) {
            toast.error('All fields are required');
            return;
        }

        
        const sup = {
            name,
            email,
            phone
        }

        if(isEdit === 'true' && id) {

            try {
                await axiosPrivate.put(`/api/suppliers/${id}`, JSON.stringify(sup), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Supplier updated');
                setName('');
                setEmail('');
                setPhone('');
                navigate('/dash/admin/supplier-management');
            } catch (err) {
                toast.error('Supplier update failed, try again');
            }

        } else {

            try {
                await axiosPrivate.post('/api/suppliers', JSON.stringify(sup), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Supplier Added');
                setName('');
                setEmail('');
                setPhone('');
            } catch (err) {
                toast.error(err.response.data.message);
            }
        }   
        
    }

    return (
        <div className='employeeAdd'>

            <aside className='employeeAdd-header'>
                <h1>{isEdit === 'true' ? 'Update Supplier' : 'Add New Supplier'}</h1>
            </aside>

            <hr></hr>

            <form className='employeeAdd-form' onSubmit={handleSubmit}>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Supplier Name (Company Name)</label>
                        <input type='text' value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Email</label>
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>  

                <div className='form-group-wrapper'>
                    <div className='form-group'>
                        <label>Contact No.</label>
                        <input type='text' value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>   

                <button className="btn btn-dark" onSubmit={handleSubmit}>{isEdit === 'true' ? 'Update Supplier' : 'Add Supplier'}</button>

            </form>

        </div>
    );
}

export default SupplierAdd;
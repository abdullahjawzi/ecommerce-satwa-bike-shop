import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Table } from 'react-bootstrap';

import { FaUserPlus } from 'react-icons/fa';

import { toast } from 'react-toastify';

import '../../styles/employee_management/employeeList.css';

const CustomerList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [customers, setCustomers] = useState([]);

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

    const handleCustomerDelete = async id => {
        const isConfirmed = window.confirm(`Are you sure that you want to remove this customer?`);

        if (isConfirmed) {
            try {
                await axiosPrivate.delete(`/api/users/manage/customer/${id}`);
                toast.success('Customer deleted');
                setCustomers(customers.filter(c => c._id !== id));
            } catch (err) {
                toast.error(err.response.data?.message);
            }
        }
    }

    return (
        <div>

            <aside className='employeeList-header'>
                <h1>Customer Management</h1>
                <button className='btn btn-primary' onClick={() => navigate('/dash/employee/customer-management/add')}>Add Customer <FaUserPlus /></button>
            </aside>

            <hr></hr>


            {customers.length > 0 && (
                <Table striped bordered hover responsive >
                    <thead>
                        <tr>
                            <th>#Customer ID</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone No.</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c._id}>
                                <td>{c.userId}</td>
                                <td>{c.username}</td>
                                <td>{c.customer?.firstName}</td>
                                <td>{c.customer?.lastName}</td>
                                <td>{c.customer?.address}</td>
                                <td>{c.customer?.email}</td>
                                <td>{c.customer?.phone}</td>
                                <td><span className={`employee-state-tagger employee-state-tagger-customer`}>{c.roles[0]}</span></td>
                                <td>
                                    <div className='d-flex align-items-center gap-2'>
                                        <button className='btn btn-sm btn-success' onClick={() => navigate(`/dash/employee/customer-management/add?edit=true&id=${c._id}`)}>Update</button>
                                        <button className='btn btn-sm btn-danger' onClick={() => handleCustomerDelete(c._id)}>Delete</button>
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

export default CustomerList;
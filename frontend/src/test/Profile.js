import React from 'react'
import './profile.css'

export default function Profile() {
  return (
    <div className="profile__main__container">
        <div className="left__side">
            <h2>Danny Jhone</h2>
            <h6>dannyjhone@gmail.com</h6>

            <div className="Personal__details__container">
                <div className="label__side">
                    <label>Fisrt Name : </label>
                    <label>Last Name :</label>
                    <label>Title  :</label>
                    <label>Address :</label>
                    <label>Telephone  :</label>
                </div>

                
                <div className="details__side">
                    <p>Danny</p>
                    <p>Jhone</p>
                    <p>Customer</p>
                    <p>No:21, Bay yard, California</p>
                    <p>+92 102 125 1545</p>
                </div>
            </div>
        </div>

        <div className="right__side">
            <h3>Update Your Details in Here!</h3>

            <div className="form__inputs">
                <label>
                    <input type="text" placeholder='Fisrt Name'></input>
                </label>

                <label>
                    <input type="text" placeholder='Last Name'></input>
                </label>

                {/* <label>
                    <select>
                        <option disabled>Title</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="customer">Customer</option>
                    </select>
                </label> */}

                <label>
                    <input type="text" placeholder='Address'></input>
                </label>

                <label>
                    <input type="tele" placeholder='Mobile Number'></input>
                </label>

                
                <div className="button__area">
                    <button>Update</button>
                </div>
            </div>
        </div>
    </div>
  )
}
 
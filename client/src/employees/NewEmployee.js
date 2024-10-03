import { useState, useEffect } from "react"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import Header from "../components/Header"
import {useDispatch} from 'react-redux'


const NewEmployee = () => {

    const [employee, setEmployee] = useState({})
    const [message, setMessage] = useState('')
    const [deps, setDeps] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const api = process.env.REACT_APP_API_URL

    useEffect(() => {
        getDepartments()
    }, [])

    const handleChange = (e) => {
        setEmployee({...employee, [e.target.name]: e.target.value})
    }

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(`${api}/employees/addemployee`, {...employee}, {withCredentials: true})
            if (data.created) {
                setMessage('Employee added successfully')
            }
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }        
    }

    const getDepartments = async () => {
        try {
            const {data} = await axios.get(`${api}/departments`, {withCredentials: true})
            setDeps(data)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    return (
        <>
        <Header />
            <h1>New Employee</h1>
            <form>
                <input type="text" placeholder ="first name" name="FirstName" onChange={(e) => handleChange(e)}/><br/>
                <input type="text" placeholder ="last name" name="LastName" onChange={(e) => handleChange(e)}/><br/>
                <input type="number" placeholder ="start work year" name="StartWorkYear" onChange={(e) => handleChange(e)}/><br/>
                <select name="DepartmentID" onChange={(e) => handleChange(e)}>
                    <option value="">Select Department</option>
                    {
                        deps.map((dep) => {
                            return (
                                <option key={dep._id} value={dep._id}>{dep.Name}</option>
                            )
                        })
                    }
                </select>
                <button onClick={(e) => handleClick(e)}>Add Employee</button>
            </form>
            <Link to='/employees'>Back</Link>
            {message && <p>{message}</p>}
        </>
    )
}

export default NewEmployee
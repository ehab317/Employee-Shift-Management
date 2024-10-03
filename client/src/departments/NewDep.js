import { useEffect, useState } from "react"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux"
import Header from "../components/Header"


const NewDep = () => {

    const [employees, setEmployees] = useState([])
    const [dep, setDep] = useState({})
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const api = process.env.REACT_APP_API_URL


    useEffect(() => {

        getEmployees()
        
    }, [])

    const getEmployees = async () => {
        try {
            const {data} = await axios.get(`${api}/employees`, {withCredentials: true})
            setEmployees(data)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const handleChange = (e) => {
        setDep({...dep, [e.target.name] : e.target.value})
    }

    const handleClick = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(`${api}/departments/addDepartment`, {...dep}, {withCredentials: true})
            dispatch({type: 'ADD_DEP', payload: data.dep})
            setMessage(data.message)
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
            <h2>New Department</h2>
            <form>
                <input type="text" placeholder ="department name" name="Name" onChange={(e) =>handleChange(e)}/><br/><br/>
                manager: <select name="Manager" onChange={(e) =>handleChange(e)}>
                    <option value=""> -- </option>
                    {
                        employees.map( emp => <option key={emp._id} value={emp._id}>{`${emp.FirstName} ${emp.LastName}`}</option>)
                    }
                    
                </select><br/>
                <button onClick={(e) => handleClick(e)}>Add</button><br/>
                <Link to='/departments'>Back</Link>
            </form>
            {message && <p>{message}</p>}
        </>
    )
}

export default NewDep
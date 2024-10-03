import axios from "axios"
import { useEffect, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import Header from "../components/Header"
import {useParams} from 'react-router-dom'
import {useDispatch} from 'react-redux'
const api = process.env.REACT_APP_API_URL

const EditDep = () => {

    const [employees, setEmployees] = useState([])
    const [depEmps, setDepEmps] = useState([])
    const [message, setMessage] = useState('')
    const [dep, setDep] = useState({})
    const [newDep, setNewDep] = useState({Name: dep.Name, Manager: dep.Manager})
    const {id} = useParams()
    const [eToAdd, setEToAdd] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getDepartment()
        getEmployees()

    }, [])

    const getDepartment = async () => {
        try {
            const {data} = await axios.get(`${api}/departments/${id}`, {withCredentials: true})
            setDep(data.dep)
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
    const handleChange = (e) => {
        setNewDep({...newDep, [e.target.name] : e.target.value})
    }

    const getEmployees = async () => {
        try {
            const {data} = await axios.get(`${api}/employees`, {withCredentials: false})
            setEmployees(data)
            let emps = []
            data.forEach(emp => {
                if(emp.DepartmentID !== id) {
                    emps.push(emp)
                }
            })
            setDepEmps(emps)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()
        if (!newDep.Manager) {
            newDep.Manager = dep.Manager._id
        }
        if (!newDep.Name) {
            newDep.Name = dep.Name
        }

        try {
            const {data} = await axios.put(`${api}/departments/editDepartment`, {newDep, id}, {withCredentials: true})
            setMessage(data.message)
            setDep(data.dep)
        } catch (error) {
            if(error.status === 403) {
                setMessage(error.response.data.message)
                localStorage.removeItem('token')
                dispatch({type: 'USER_LOGOUT'})
                setTimeout(() => navigate('/'), 3000)
            }
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.delete(`${api}/departments/deleteDepartment/${id}`, {withCredentials: true})
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

    const handleEToAdd = async (e) => {
        const emp = employees.find(emp => emp._id === eToAdd)
        emp.DepartmentID = id
        try {
            const {data} = await axios.put(`${api}/employees/editemployee`, {_id: emp._id, FirstName: emp.FirstName, LastName: emp.LastName, DepartmentID: id}, {withCredentials: true})
            setDepEmps( depEmps.filter(emp => emp._id !== eToAdd) )
            setMessage('Employee updated successfully')
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
                <h2>Edit Department</h2>
                <form>
                    Name: <input type="text" placeholder ="department name" name="Name" onChange={(e) =>handleChange(e)} defaultValue={dep.Name}/><br/><br/>
                    manager: <select name="Manager" value={newDep.Manager} onChange={(e) =>handleChange(e)}>
                        <option value=""> -- </option>
                        {
                            employees.map( emp => <option key={emp._id} value={emp._id} selected={emp._id === dep.Manager._id}>{`${emp.FirstName} ${emp.LastName}`}</option>)
                        }
                        
                    </select><br/>
                    <button onClick={(e) => handleClick(e)}>Update</button><button onClick={(e) => handleDelete(e)}>Delete</button><br/>
                </form>
                <select onChange={(e) => setEToAdd(e.target.value)}>
                    <option value="">Add Employee</option>
                    {
                        depEmps.map(emp => <option key={emp._id} value={emp._id}>{`${emp.FirstName} ${emp.LastName}`}</option>)
                    }
                </select>
                <button onClick={(e) => handleEToAdd(e)}>Add Employee</button>
                {message && <p>{message}</p>}
                <br/>
                <Link to='/departments'>Back</Link>
        </>
    )
}

export default EditDep
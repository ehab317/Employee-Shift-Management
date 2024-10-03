import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useSelector, useDispatch } from "react-redux"

const Deps = () => {

    const [departments, setDepartments] = useState([])
    const api = process.env.REACT_APP_API_URL
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const {user} = useSelector( state => state.user )
    const navigate = useNavigate()

    if(!user) {
        navigate('/login')
    }

    useEffect( () => {

        getDepartments()
    }, [])

    const getDepartments = async () => {
        try {
            const {data} = await axios.get(`${api}/departments`, {withCredentials: true})
            setDepartments(data)
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
            <h1>Departments</h1>
            <Link to='/departments/newdep'>Add New Department</Link>
            <br/>
            <br/>
            <table border={1} style={{margin:'auto'}}>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Manager</th>
                        <th>Employees</th>
                    </tr>
                </thead>
                <tbody>
                   {
                    departments.map( dep => (
                        <tr key={dep._id}>
                            <td><Link to={`/departments/${dep._id}`}>{dep.Name}</Link></td>
                            <td>{`${dep.Manager.FirstName} ${dep.Manager.LastName}`}</td>
                            <td>
                                <table border={1} style={{width: '100%'}}>
                                    <tbody>
                                        {
                                            dep.employees.map( emp => (
                                                <tr key={emp._id}><td><Link to={`/employees/${emp._id}`}>{`${emp.FirstName} ${emp.LastName}`}</Link></td></tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))
                   }
                </tbody>
            </table>
            <br/>
            <p>{message}</p>
            <Link to='/'>Home</Link>
        </>
    )
}

export default Deps
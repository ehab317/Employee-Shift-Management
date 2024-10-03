import Header from '../components/Header'
import axios from 'axios'
import {useEffect, useState} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
const api = process.env.REACT_APP_API_URL


const Users = () => {

    const [users, setUsers] = useState([])
    const {user} = useSelector( state => state.user )
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect( () => {

        if(!user) {
            navigate('/login')
        }
        const getUsers = async () => {
            try {
                const {data} = await axios.get(`${api}/users`, {withCredentials: true})
                setUsers(data)              
            } catch (error) {
                if(error.status === 403) {
                    setMessage(error.response.data.message)
                    localStorage.removeItem('token')
                    dispatch({type: 'USER_LOGOUT'})
                    setTimeout(() => navigate('/'), 3000)
                }
            }
        }
        getUsers()
    },[])

    return (
        <>
        <Header />
            <h1>Users</h1>
            <table style={{margin: "auto"}} border={1}>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Max Actions</th>
                        <th>Remaining Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map( user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.maxActions}</td>
                                <td>{user.latestAction ? user.latestAction.actionsAllowed : user.maxActions}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <br/>
            <Link to={'/'}>Home</Link>
            <br/>
            <p>{message}</p>
        </>
    )
}

export default Users
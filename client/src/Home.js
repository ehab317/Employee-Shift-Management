import { Link } from "react-router-dom"
import Header from "./components/Header"
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import axios from "axios"

const Home = () => {

    const [user, setUser] = useState({username:'', email: '', name: ''})
    const [massege, setMassege] = useState('')
    const dispatch = useDispatch()
    const api = process.env.REACT_APP_API_URL

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token && !user.name) {
            handleToken(token)
        }
    }, [])

    const handleToken = async (token) => {
        try {
            const {data} = await axios.get(`${api}/users/login/${token}`, {withCredentials: true})
            if(data.success) {
                localStorage.setItem('token', data.token)
                setUser({...user , ...data.userObj})
                setMassege('')
                dispatch({type: 'USER_LOGIN', payload: data.userObj})
            }
        } catch (error) {
            if(error.status === 403) {
                setMassege(error.response.data.message)
                localStorage.removeItem('token')
                setUser({username:'', email: '', name: ''})
                dispatch({type: 'USER_LOGOUT'})
            }
        }

    }

    return (
        <div>
            <Header />
            <h1>Home</h1>
            <Link to='/employees'>Employees</Link><br/>
            <Link to='/Departments'>Departments</Link><br/>
            <Link to='/shifts'>Shifts</Link><br/>
            <Link to='/users' >Users</Link>
            <br/>
            <p>{massege}</p>
        </div>
    )
}

export default Home
import { useState } from "react"
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch } from "react-redux"

const Login = () => {

    const api = process.env.REACT_APP_API_URL
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [user, setUser] = useState({username:'', email: '', name: ''})



    
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const handleClick = async (e) => {
        e.preventDefault()
        const {data} = await axios.post(`${api}/users/login`, {username: user.username, email: user.email})
        if(data.success) {
            localStorage.setItem('token', data.token)
            setUser({...user , ...data.userObj})
            dispatch({type: 'USER_LOGIN', payload: data.userObj})
            navigate('/')
        }
    }
    return (
        <>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="username" name="username" onChange={(e) => handleChange(e)} /><br/>
                <input type="text" placeholder="email" name="email" onChange={(e) => handleChange(e)} /><br/>
                <button onClick={(e) => handleClick(e)}>Login</button>
            </form>
            <br/>
            <Link to='/'>Back</Link>
        </>
    )
}

export default Login
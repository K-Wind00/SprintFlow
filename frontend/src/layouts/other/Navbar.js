import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../services/auth'

const Navbar = () => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const dispatch = useDispatch()
	if (!isAuthenticated) {
		return ''
	}
	return (
		<nav className='navbar'>
			<Link to='/dashboard'>Sprint Flow</Link>
			<Link to='/' onClick={() => dispatch(logout())}>
				Wyloguj się
			</Link>
		</nav>
	)
}

export default Navbar

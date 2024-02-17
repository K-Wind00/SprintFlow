import React from 'react'
import { Button } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Landing = () => {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

	if (isAuthenticated) {
		return <Redirect to='/dashboard' />
	}

	return (
		<section className='landing'>
			<nav className='top'>
				<h2>Sprint Flow</h2>
				<div>
					<Button color='inherit' href='/login'>
						Zaloguj się
					</Button>
					<Button variant='contained' href='/register'>
						Zarejestruj się
					</Button>
				</div>
			</nav>
			<div className='landing-inner'>
				<h1>Sprint flow</h1>
				<div className='buttons'>
					<Button variant='outlined' color='inherit' href='/login'>
						Zaloguj się
					</Button>
					<Button variant='outlined' color='inherit' href='/register'>
						Zarejestruj się
					</Button>
				</div>
			</div>
		</section>
	)
}

export default Landing

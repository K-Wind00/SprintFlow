import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../services/auth'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import useStyles from '../../common/formStyles'

const Login = () => {
	const classes = useStyles()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
	const dispatch = useDispatch()

	const { email, password } = formData

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		e.preventDefault()
		dispatch(login(email, password))
	}

	if (isAuthenticated) {
		return <Redirect to='/dashboard' />
	}

	return (
		<Container component='main' maxWidth='xs' className={classes.container}>
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component='h1' variant='h5'>
					Zaloguj się
				</Typography>
				<form className={classes.form} onSubmit={e => onSubmit(e)}>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						label='Adres email'
						name='email'
						autoComplete='email'
						autoFocus
						value={email}
						onChange={e => onChange(e)}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Hasło'
						type='password'
						autoComplete='current-password'
						value={password}
						onChange={e => onChange(e)}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}>
						Zaloguj się
					</Button>
					<Grid container justify='flex-end'>
						<Grid item>
							<Link href='/register' variant='body2'>
								Nie masz jeszcze konta? Stwórz je!
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	)
}

export default Login

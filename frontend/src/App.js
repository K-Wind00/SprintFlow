import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './layouts/pages/Landing'
import Register from './layouts/pages/Register'
import Login from './layouts/pages/Login'
import Dashboard from './layouts/pages/Dashboard'
import Board from './layouts/pages/Board'
import Alert from './layouts/other/Alert'

import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './services/auth'
import setAuthToken from './common/setAuthToken'

import './App.css'

if (localStorage.token) {
	setAuthToken(localStorage.token)
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Alert />
					<Switch>
						<Route exact path='/' component={Landing} />
						<Route exact path='/register' component={Register} />
						<Route exact path='/login' component={Login} />
						<Route exact path='/dashboard' component={Dashboard} />
						<Route exact path='/board/:id' component={Board} />
					</Switch>
				</Fragment>
			</Router>
		</Provider>
	)
}

export default App

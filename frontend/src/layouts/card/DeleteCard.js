import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteCard } from '../../services/board'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'

const DeleteCard = ({ cardId, setOpen, list }) => {
	const [openDialog, setOpenDialog] = useState(false)
	const dispatch = useDispatch()

	const handleClickOpen = () => {
		setOpenDialog(true)
	}

	const handleClose = () => {
		setOpenDialog(false)
	}

	const onDeleteCard = async () => {
		dispatch(deleteCard(list._id, cardId))
		setOpenDialog(false)
		setOpen(false)
	}

	return (
		<div>
			<Button variant='contained' color='secondary' onClick={handleClickOpen}>
				Usun zadanie
			</Button>
			<Dialog open={openDialog} onClose={handleClose}>
				<DialogTitle>{'Czy na pewno chcesz usunąć zadanie?'}</DialogTitle>
				<DialogActions>
					<Button
						onClick={onDeleteCard}
						variant='contained'
						color='secondary'
						autoFocus>
						Usuń
					</Button>
					<Button onClick={handleClose}>Zamknij</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

DeleteCard.propTypes = {
	cardId: PropTypes.string.isRequired,
	setOpen: PropTypes.func.isRequired,
	list: PropTypes.object.isRequired,
}

export default DeleteCard

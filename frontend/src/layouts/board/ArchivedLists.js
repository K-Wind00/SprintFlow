import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { archiveList } from '../../services/board'
import { List, Button, ListItem, ListItemText } from '@material-ui/core'

const ArchivedLists = () => {
	const listObjects = useSelector(state => state.board.board.listObjects)
	const dispatch = useDispatch()

	const onSubmit = async listId => {
		dispatch(archiveList(listId, false))
	}

	return (
		<div>
			<List>
				{listObjects
					.filter(list => list.archived)
					.map((list, index) => (
						<ListItem key={index}>
							<ListItemText primary={list.title} />
							<Button onClick={() => onSubmit(list._id)}>
								Wyślij na tablice
							</Button>
						</ListItem>
					))}
			</List>
		</div>
	)
}

export default ArchivedLists

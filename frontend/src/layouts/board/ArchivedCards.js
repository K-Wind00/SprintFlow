import React from 'react'
import { archiveCard, deleteCard } from '../../services/board'
import { Card, List, ListItem, CardContent, Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'

const ArchivedCards = () => {
	const cards = useSelector(state => state.board.board.cardObjects)
	const lists = useSelector(state => state.board.board.listObjects)
	const dispatch = useDispatch()

	const onDelete = async (listId, cardId) => {
		dispatch(deleteCard(listId, cardId))
	}

	const onSendBack = async cardId => {
		dispatch(archiveCard(cardId, false))
	}

	return (
		<div>
			<List>
				{cards
					.filter(card => card.archived)
					.map((card, index) => (
						<ListItem key={index} className='archived-card'>
							<Card>
								<CardContent>{card.title}</CardContent>
							</Card>
							<div>
								<Button
									color='secondary'
									onClick={() =>
										onDelete(
											lists.find(list => list.cards.includes(card._id))._id,
											card._id
										)
									}>
									Usuń
								</Button>
								<Button onClick={() => onSendBack(card._id)}>
									Przenieś na liste
								</Button>
							</div>
						</ListItem>
					))}
			</List>
		</div>
	)
}

export default ArchivedCards

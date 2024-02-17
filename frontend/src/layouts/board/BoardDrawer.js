import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Moment from 'react-moment'
import {
	Drawer,
	List,
	Divider,
	Button,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import CloseIcon from '@material-ui/icons/Close'
import ArchiveIcon from '@material-ui/icons/Archive'

import ArchivedLists from './ArchivedLists'
import ArchivedCards from './ArchivedCards'
import useStyles from '../../common/drawerStyles'

const BoardDrawer = () => {
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [viewingArchivedLists, setViewingArchivedLists] = useState(false)
	const [viewingArchivedCards, setViewingArchivedCards] = useState(false)
	const [activityChunks, setActivityChunks] = useState(1)
	const activity = useSelector(state => state.board.board.activity)

	const handleClose = () => {
		setOpen(false)
		setActivityChunks(1)
	}

	return (
		<div>
			<Button
				onClick={() => setOpen(true)}
				variant='contained'
				className={open ? classes.hide : classes.showMenuButton}>
				Menu
			</Button>
			<Drawer
				className={open ? classes.drawer : classes.hide}
				variant='persistent'
				anchor='right'
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}>
				{!viewingArchivedLists && !viewingArchivedCards ? (
					<div>
						<div className={classes.drawerHeader}>
							<h3>Menu</h3>
							<Button onClick={handleClose}>
								<CloseIcon />
							</Button>
						</div>
						<Divider />
						<List>
							<ListItem button onClick={() => setViewingArchivedLists(true)}>
								<ListItemIcon>
									<ArchiveIcon />
								</ListItemIcon>
								<ListItemText primary={'Zarchiwizowane listy'} />
							</ListItem>
							<ListItem button onClick={() => setViewingArchivedCards(true)}>
								<ListItemIcon>
									<ArchiveIcon />
								</ListItemIcon>
								<ListItemText primary={'Zarchiwizowane zadania'} />
							</ListItem>
						</List>
						<Divider />
						<div className={classes.activityTitle}>
							<h3>Historia</h3>
						</div>
						<List>
							{activity.slice(0, activityChunks * 10).map(activity => (
								<ListItem key={activity._id}>
									<ListItemText
										primary={activity.text}
										secondary={<Moment fromNow>{activity.date}</Moment>}
									/>
								</ListItem>
							))}
						</List>
						<div className={classes.viewMoreActivityButton}>
							<Button
								disabled={activityChunks * 10 > activity.length}
								onClick={() => setActivityChunks(activityChunks + 1)}>
								Zobacz więcej
							</Button>
						</div>
					</div>
				) : viewingArchivedLists ? (
					<div>
						<div className={classes.drawerHeader}>
							<Button onClick={() => setViewingArchivedLists(false)}>
								<ChevronLeftIcon />
							</Button>
							<h3>Zarchiwizowane listy</h3>
							<Button onClick={handleClose}>
								<CloseIcon />
							</Button>
						</div>
						<Divider />
						<ArchivedLists />
					</div>
				) : (
					<div>
						<div className={classes.drawerHeader}>
							<Button onClick={() => setViewingArchivedCards(false)}>
								<ChevronLeftIcon />
							</Button>
							<h3>Zarchiwizowane zadania</h3>
							<Button onClick={handleClose}>
								<CloseIcon />
							</Button>
						</div>
						<Divider />
						<ArchivedCards />
					</div>
				)}
				<Divider />
			</Drawer>
		</div>
	)
}

export default BoardDrawer

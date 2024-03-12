import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import EventChildCard from "../event-details-card/child-card-view/EventChildCard";

const useStyles = makeStyles({
    draggingListItem: {
        background: 'rgb(235,235,235)',
    },
});

const DraggableListItem = ({ item, index }) => {
    const classes = useStyles();

    return (
        <Draggable draggableId={String(item.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? classes.draggingListItem : ''}
                >
                       <EventChildCard event={item}/>
                </div>
            )}
        </Draggable>
    );
};

export default DraggableListItem;

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import BookmarkAddTwoToneIcon from '@mui/icons-material/BookmarkAddTwoTone';

function TableRowActions({ been_played, disliked, onMarkAsPlayed, onMarkAsNotPlaying, onDeleteRequest, onMessageRequester, onBookmark }) {
  
  function handleMarkAsPlayed() {
    onMarkAsPlayed();
  }

  function handleMarkAsNotPlaying() {
    onMarkAsNotPlaying();
  }

  function handleDeleteRequest() {
    onDeleteRequest();
  }

  function handleMessageRequester() {
    onMessageRequester();
  }

  function handleBookmark() {
    onBookmark();
  }

  return (
    <>
      {/* Mark as Played */}
      <Tooltip title="Mark as Played">
        <IconButton size="small" onClick={handleMarkAsPlayed}>
          <CheckCircleIcon size="small" color={been_played ? 'success' : 'action'} />
        </IconButton>
      </Tooltip>

      {/* Mark as Not Going to Play */}
      <Tooltip title="Not Playing">
        <IconButton size="small" onClick={handleMarkAsNotPlaying}>
          <ThumbDownIcon size="small" color={disliked ? 'warning' : 'action'} />
        </IconButton>
      </Tooltip>

      {/* Delete Request */}
      <Tooltip title="Delete Request">
        <IconButton size="small" onClick={handleDeleteRequest}>
          <DeleteIcon size="small" color="error" />
        </IconButton>
      </Tooltip>

      {/* Message Requester */}
      <Tooltip title="Message Requester">
        <IconButton size="small" onClick={handleMessageRequester}>
          <MailIcon size="small" color="primary" />
        </IconButton>
      </Tooltip>

      {/* Bookmark Request */}
      <Tooltip title="Bookmark">
        <IconButton size="small" onClick={handleBookmark}>
          <BookmarkAddTwoToneIcon size="small" color="action" />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default TableRowActions;
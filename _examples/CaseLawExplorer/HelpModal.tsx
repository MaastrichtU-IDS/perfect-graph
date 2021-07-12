import {
  Modal
} from '@material-ui/core';
import React from 'react';


type HelpModalProps = {
  isOpen: boolean
  videoId: string
  onClose: () => void
}

export const HelpModal = (props: HelpModalProps) => {
  const {
    isOpen,
    videoId,
    onClose
  } = props
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </Modal>
  )
}
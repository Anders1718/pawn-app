import React from 'react'
import Sheet from '../ui/Sheet'

// Legacy API kept for older call sites: <ModalPaw isOpen>. New code should
// use <Sheet visible onClose title>.
export const ModalPaw = ({ isOpen, onClose, children, ...rest }) => (
    <Sheet visible={isOpen} onClose={onClose} {...rest}>{children}</Sheet>
)

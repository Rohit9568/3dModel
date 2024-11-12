import { Modal } from '@mantine/core';
import './ModalWithImage.css'
import { useState } from 'react';

export default function ModalWithImage (props:{
  imgUrl:string,
  paymentAmount:string,
  isOpen:boolean,
  handleModalClose: (isOpen:boolean)=>void
}){


      return (
        <Modal
        opened={props.isOpen}
        onClose={() => {
          props.handleModalClose(false)
        }}
        title ="Pay Using QR Code"
        size="auto"
        zIndex={9999}
        shadow="20px"
        centered
      >  
          <div className="centered-container">
        <div className="image-container">
          <img
            className="image"
            src={props.imgUrl}
            height="300px"
            width="300px"
            alt="Payment Image"
          />
          <div className="payment-text">
          Amount to be Paid: <span className="bold-text"> Rs {props.paymentAmount}</span>
          </div>
        </div>
      </div>
    </Modal>

    
      );
  }
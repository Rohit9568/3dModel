import React from 'react'
import styled from 'styled-components'
import { Icon } from '../../pages/_New/Teach'
import { IconEmptyContent } from '../_Icons/CustonIcons'

interface IProps {
    setAddContentModalOpen: (s: boolean) => void
}

const AddContent:React.FC<IProps> = ({ setAddContentModalOpen}) =>{
  return (
    <Container>
        <IconEmptyContent />
        <p>Content not added yet!</p>
        <StyledButton onClick={() => { setAddContentModalOpen(true) }}>Add Content</StyledButton>
    </Container>
  )
}

export default AddContent

const Container = styled.div`
    height: 100%;
    width: 100%;
    padding:0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen {
        padding:0 10px;
    }
    p {
        font-family: 'Nunito';
        font-weight: 400;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        margin: 20px;
    }
    `

const StyledButton = styled.button`
    font-family: 'Nunito';
    border: 0;
    /* width: 135px;
    height: 36px; */
    border-radius: 24px;
    padding: 12px 24px;
    background-color: #4B65F6;
    color: white;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    line-height: 21px;
`
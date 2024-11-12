
import React from 'react'
import styled from 'styled-components'

function RefundPolicyScreen() {
  return (
    <Container>
      <TextContainer>
        <h1>Vignam Labs Pvt Ltd Refund Policy</h1>

        <p>Effective Date: November 6, 2023</p>

        <h2>1.Refund Policy: </h2>

        <p>We do not offer refunds for any products or services.</p>
        <h2>2.Non-Refundable Items: </h2>

        <p>All sales are final, and no refunds will be issued.</p>
        <h2>3.Cancellation Policy: </h2>

        <p>Orders cannot be canceled, as we do not offer refunds.</p>

        <h2>4. Policy Updates:</h2>

        <p>
          We reserve the right to modify this policy at any time. Any changes will be effective
          immediately upon posting the updated policy on our website.
        </p>

        <h2>5. Contact Us</h2>

        <p>If you have any questions about our policy, please contact us at:</p>

        <p>
          Vignam Labs Pvt Ltd
          <br />
          Plot No 34, Nehru Colony
          <br />
          Near Petrol Pump, Rohtak HR 124001
          <br />
          Email: ceo@vignam.in
          <br />
          Phone: 9650488030
        </p>
        <p>
          By engaging with Vignam, you acknowledge and agree to our no-refund policy. We appreciate
          your understanding and look forward to serving you.
        </p>
      </TextContainer>
    </Container>
  )
}

export default RefundPolicyScreen

const Container = styled.div`
  max-width: 100vw;
  margin-left: auto;
  margin-right: auto;
  color: black;
   background-color: #212428; 
  overflow-x: hidden;
  font-family: Nunito;
`

const TextContainer = styled.div`
  color: white;
  max-width: 960px;
  margin-left: auto;
  overflow-x: hidden;
  margin-right: auto;
  padding: 20px 16px;
  font-family: Nunito;
  h1 {
    font-size: 2em;
    line-height: 1.55;
    font-weight: 700;
  }
  h2 {
    line-height: 1.55;
    font-size: 20px;
    font-weight: 700;
    margin-top: 25px;
    margin-bottom: 5px;
  }
  p {
    line-height: 1.55;
    font-size: 16px;
    margin: 0 16px;
  }
  ul {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 20px; // This indents the list from the left
    padding-left: 20px; // Adds padding inside the list for further indentation
  }

  li {
    margin-bottom: 10px; // Adds space between list items
    list-style-type: disc; // Ensures items have bullets
  }
`

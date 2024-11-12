import React from "react";
import styled from "styled-components";

function TermsScreen() {
  return (
    <Container>
      <TextContainer>
        <h1>Vignam Labs Pvt Ltd Terms of Use</h1>

        <p>Effective Date: November 6, 2023</p>

        <h2>1. Acceptance of Terms</h2>

        <p>
          Welcome to Vignam Labs Pvt Ltd ("we", "our", or "us"). By accessing or
          using our mobile application and related services (collectively, the
          "Service"), you agree to comply with and be bound by these Terms of
          Use. If you do not agree to these Terms of Use, please do not use our
          Service.
        </p>

        <h2>2. Use of the Service</h2>

        <p>
          You agree to use the Service in accordance with all applicable laws
          and regulations. You further agree not to:
        </p>
        <ul>
          <li>Violate any local, state, national or international laws;</li>
          <li>
            Impersonate any person or entity or falsely state or otherwise
            misrepresent your affiliation with a person or entity;
          </li>
          <li>
            Interfere with or disrupt the Service or servers or networks
            connected to the Service;
          </li>
          <li>
            Attempt to gain unauthorized access to other computer systems
            through the Service.
          </li>
        </ul>

        <h2>3. User Accounts</h2>

        <p>
          To access certain features of the Service, you may be required to
          create an account. You are responsible for maintaining the
          confidentiality of your account information and password.
        </p>

        <h2>4. Intellectual Property</h2>

        <p>
          The Service and its original content, features, and functionality are
          owned by Vignam Labs Pvt Ltd and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual
          property or proprietary rights laws.
        </p>

        <h2>5. Limitation of Liability</h2>

        <p>
          In no event shall Vignam Labs Pvt Ltd, nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your use or inability to
          use the Service; (ii) any unauthorized access to or use of our servers
          and/or any personal information stored therein.
        </p>

        <h2>6. Refund Policy</h2>

        <p>
          All sales are final. We do not offer refunds for any products or
          services purchased .
        </p>

        <h2>7. Changes to Terms</h2>

        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms of Use at any time. By continuing to access or use our
          Service after those revisions become effective, you agree to be bound
          by the revised terms.
        </p>

        <h2>8. Contact Us</h2>

        <p>
          If you have any questions about these Terms of Use, please contact us
          at:
        </p>

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
      </TextContainer>
    </Container>
  );
}

export default TermsScreen;

const Container = styled.div`
  max-width: 100vw;
  margin-left: auto;
  margin-right: auto;
  color: black;
  background-color: #212428;
  overflow-x: hidden;
  font-family: Nunito;
`;

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
`;

import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

function PrivacyPolicyScreen() {
  
  const params = useParams();
  const instituteName = params.instituteName??"Vignam";

  return (
    <Container>
      <TextContainer>
        <h1>Privacy Policy</h1>
        <p>Effective Date: November 6, 2023</p>
        <h2>1. Introduction</h2>
        <p>
          We are  {instituteName} and we are
          committed to protecting your privacy and providing you with a positive
          experience while using our mobile application and related services
          (collectively, the "Service"). This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use
          our Service. By accessing or using our Service, you agree to the terms
          of this Privacy Policy.
        </p>
        <h2>2. Information We Collect</h2>
        <p>
        We collect personal and non-personal information when you use our Service. 
        Personal information includes data such as your name, phone number, email address, and other details you provide us. 
        We may also collect information about teachers and students, including but not limited to, study materials, questions, shared content, and user-generated data. Additionally, 
        we request permission to access and collect photos, videos, and user files. 
        This means that we may have access to and collect information related to the photos, videos, and files stored on your device or shared through our Service.
        <br/><br/>
        <b>Media Files:</b> With your consent, we may collect photos, videos, and files from your device to provide you with the functionality of our App.
        </p>
        <h2>3. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our Service. Your data helps us enhance our app features, optimize
          content, and personalize your app experience. Teachers can share
          content with their students, and we may process student details
          provided by teachers on our platform. We use this data to facilitate
          the interaction between teachers and students, allowing for a more
          engaging learning experience.
        </p>
        <h2>4. Data Sharing and Disclosure</h2>
        <p>
          We may share your personal information with third parties, such as
          service providers and business partners, for specific purposes related
          to providing the Service. Teachers' shared content may be visible to
          their students. We do not sell or rent your personal information to
          third parties for their marketing purposes.
        </p>
        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal
          information from unauthorized access, disclosure, alteration, and
          destruction. However, please be aware that no method of transmission
          over the internet or electronic storage is 100% secure.
        </p>
        <h2>6. Your Choices</h2>
        <p>
          You can review, update, or delete your personal information through
          the Service. If you have any questions or concerns about your data,
          please contact us using the information provided below.
        </p>
        <h2>7. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes to our
          information practices. We encourage you to periodically review this
          page for the latest information on our privacy practices.
        </p>
      </TextContainer>
    </Container>
  );
}

export default PrivacyPolicyScreen;

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

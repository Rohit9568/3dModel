import { Stack } from "@mantine/core";
import { InstituteTheme } from "../../@types/User";
import { TeamMemberstype } from "../../components/WebsiteBuilder/OurTeamEdit";
import { AboutUs } from "./components/AboutUs";
import { CoursesDisplay } from "./components/CoursesDisplay";
import { Facilities } from "./components/Facilities";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { HeroSection } from "./components/HeroSection";
import { NoticesDisplay } from "./components/NoticesDisplay";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";
import { TopBar } from "./components/TopBar";
import React, { useEffect } from "react";
import { Benefits } from "./components/Benefits";
import { Student } from "./components/Student";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Banner } from "./components/Banner";
export const InstituteWebsite = (props: {
  instituteDetails: InstituteWebsiteDisplay;
  loggedIn: boolean;
  onLoginSubmit: (val: string, password?: string | null) => void;
  error: string | null;
  setSelectedCourse: (val: Course | null) => void;
  courses: Course[] | null;
  onCoursesPageClick: () => void;
  mainPath: string;
}) => {
  const customTheme: InstituteTheme = props.instituteDetails.theme;
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("tab");

  const navigate = useNavigate();


  return (
    <Stack spacing={0} w={"100%"}>
      <TopBar
        onClick={(val) => {
          if (
            props.courses === null ||
            !props.courses.find((x) => x._id === val._id)
          )
            props.setSelectedCourse(val);
          else {
            props.onCoursesPageClick();
          }
        }}
        course={props.instituteDetails.instituteCourses}
        about={props.instituteDetails.SubSection}
        theme={customTheme}
        logo={props.instituteDetails.schoolIcon}
        admissionUrl={props.instituteDetails.admissionUrl}
        loggedIn={props.loggedIn}
        onLoginSubmit={(phoneNo, password) => {
          props.onLoginSubmit(phoneNo, password);
        }}
        error={props.error}
        instituteDetails={props.instituteDetails}
        onLoginClicked = {()=>{
         navigate(`/${props.instituteDetails.name}/${props.instituteDetails._id}/parent`);
        }}
      />
      {(search == "hero" || search == null) && (
        <HeroSection
          theme={customTheme}
          Layout={props.instituteDetails.Layout}
          Alignment={props.instituteDetails.Alignment}
          heading={props.instituteDetails.heroSection.heading}
          instituteName={props.instituteDetails.name}
          heroImage={
            props.instituteDetails.heroSection.heroImage ||
            "https://vignam-content-images.s3.amazonaws.com/2024-01-01T20-16-16-971Z.jpg"
          }
          institutePhoneNumber={props.instituteDetails.institutePhoneNumber}
        />
      )}

      {search === "about" && (
        <AboutUs
          id={props.instituteDetails.SubSection._id || ""}
          key={props.instituteDetails._id}
          instituteId={props.instituteDetails._id}
          theme={customTheme}
          heading={
            props.instituteDetails.aboutUsDetails?.heading ||
            props.instituteDetails.name
          }
          description={props.instituteDetails.aboutUs || ""}
          points={
            props.instituteDetails.aboutUsDetails?.points || [
              "Homelike Environment",
              "Quality Educators",
              "Safety and Security",
              "Play to Learn",
            ]
          }
          imageHub={props.instituteDetails.aboutUsImages || []}
        />
      )}
      {(search == "hero" || search == null) && (
        <React.Fragment>
          <CoursesDisplay
            theme={customTheme}
            courses={props.instituteDetails.instituteCourses}
            onClick={(val) => {
              props.setSelectedCourse(val);
            }}
          />
          <AboutUs
            id={props.instituteDetails.SubSection._id || ""}
            key={props.instituteDetails._id}
            instituteId={props.instituteDetails._id}
            theme={customTheme}
            heading={
              props.instituteDetails.aboutUsDetails?.heading ||
              props.instituteDetails.name
            }
            description={props.instituteDetails.aboutUs || ""}
            points={
              props.instituteDetails.aboutUsDetails?.points || [
                "Homelike Environment",
                "Quality Educators",
                "Safety and Security",
                "Play to Learn",
              ]
            }
            imageHub={props.instituteDetails.aboutUsImages || []}
          />
        </React.Fragment>
      )}
      {props.instituteDetails.SubSection.map(
        (item: any) =>
          search === `about_${item.heading}` && (
            <React.Fragment key={item._id}>
              <AboutUs
                id={props.instituteDetails.SubSection[0]._id || ""}
                instituteId={item._id}
                theme={customTheme}
                heading={item.heading || props.instituteDetails.name}
                description={item.desc}
                points={
                  item.points || [
                    "Homelike Environment",
                    "Quality Educators",
                    "Safety and Security",
                    "Play to Learn",
                  ]
                }
                imageHub={item.img}
              />
              <CoursesDisplay
                theme={customTheme}
                courses={props.instituteDetails.instituteCourses}
                onClick={(val) => {
                  if (
                    props.courses === null ||
                    !props.courses.find((x) => x._id === val._id)
                  )
                    props.setSelectedCourse(val);
                  else {
                    props.onCoursesPageClick();
                  }
                }}
              />
            </React.Fragment>
          )
      )}
      {(search === "hero" || search == null) && (
        <Benefits
          theme={customTheme}
          instituteName={props.instituteDetails.name}
          benefits={props.instituteDetails.instituteBenefits}
          instituteBenefitsTagLine={
            props.instituteDetails.instituteBenefitsTagLine
          }
        />
      )}

      <NoticesDisplay
        theme={customTheme}
        notices={props.instituteDetails.notices}
        instituteName={props.instituteDetails.name}
        instituteId={props.instituteDetails._id}
        loggedIn={props.loggedIn}
        mainPath={props.mainPath}
      />

      {(search == null || search == "hero" || search == "facilities") && (
        <Facilities
          theme={customTheme}
          instituteName={props.instituteDetails.name}
          facilities={props.instituteDetails.facilities}
        />
      )}

      {search == "gallery" &&
        props.instituteDetails.gallerySections &&
        props.instituteDetails.gallerySections.length > 0 && (
          <Gallery
            theme={customTheme}
            gallerySections={props.instituteDetails.gallerySections}
          />
        )}
      {search === "courses" && (
        <CoursesDisplay
          theme={customTheme}
          courses={props.instituteDetails.instituteCourses}
          onClick={(val) => {
            console.log("helloIW")
            if (
              props.courses === null ||
              !props.courses.find((x) => x._id === val._id)
            )
              props.setSelectedCourse(val);
            else {
              props.onCoursesPageClick();
            }
          }}
        />
      )}

      {(search === "hero" || search == null) && (
        <Testimonials
          theme={customTheme}
          testimonials={props.instituteDetails.testimonials}
        />
      )}
      {(search === "hero" || search == null) && (
        <Team
          theme={customTheme}
          teamMembers={props.instituteDetails.teamMembers}
          teamMembertype={TeamMemberstype.TeamMembers}
          title="Meet Our Team"
        />
      )}

      {(search === "hero" || search == null) && (
        <Stack bg={customTheme.backGroundColor}>
          <Student
            theme={customTheme}
            teamMembers={props.instituteDetails.topperStudents}
            teamMembertype={TeamMemberstype.CoreTeamMembers}
            title="Our Star Students"
          />
        </Stack>
      )}

      {(search === "hero" || search == null) && (
        <Stack bg={customTheme.backGroundColor}>
          <Team
            theme={customTheme}
            teamMembers={props.instituteDetails.coreTeamMembers}
            teamMembertype={TeamMemberstype.TopperStudents}
            title="Director's Corner"
          />
        </Stack>
      )}

      <Banner
        theme={customTheme}
        phoneNo={props.instituteDetails.institutePhoneNumber}
      ></Banner>
      <Footer
        onClick={(val) => {
          if (
            props.courses === null ||
            !props.courses.find((x) => x._id === val._id)
          )
            props.setSelectedCourse(val);
          else {
            props.onCoursesPageClick();
          }
        }}
        course={props.instituteDetails.instituteCourses}
        instituteId={props.instituteDetails._id}
        logo={props.instituteDetails.schoolIcon}
        footerDescription={props.instituteDetails.footerDescription}
        email={props.instituteDetails.instituteEmail}
        phoneNumber={props.instituteDetails.institutePhoneNumber}
        instituteAddress={props.instituteDetails.Address}
        admissionUrl={props.instituteDetails.admissionUrl}
        mapUrl={props.instituteDetails.mapUrl}
        facebookLink={props.instituteDetails.facebookLink}
        instagramLink={props.instituteDetails.instagramLink}
        youtubeLink={props.instituteDetails.youtubeLink}
        secondinstituteAddress={props.instituteDetails.secondAddress}
        secondphoneNumber={props.instituteDetails.secondInstituteNumber}
      />
    </Stack>
  );
};

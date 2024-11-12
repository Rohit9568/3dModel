import { Button, Center, Flex, LoadingOverlay, Modal, Stack, TextInput, useMantineTheme } from "@mantine/core";
import { TopBar } from "./TopBar";
import { useMediaQuery } from "@mantine/hooks";
import { HeroSectionEdit } from "./HeroSectionEdit";
import { NoticesEdit } from "./NoticesEdit";
import { AboutUsEdit } from "./AboutUsEdit";
import { OurFacilitiesEdit } from "./OurFacilitiesEdit";
import { TestimonialsEdit } from "./TestimonialsEdit";
import { GalleryEdit } from "./GalleryEdit";
import { FooterEdit } from "./FooterEdit";
import { useEffect, useState } from "react";
import { OurTeamEdit, TeamMemberstype } from "./OurTeamEdit";
import { Mixpanel } from "../../utilities/Mixpanel/MixpanelHelper";
import { WebAppEvents } from "../../utilities/Mixpanel/AnalyticeEventWebApp";
import { InstituteBenefitsEdit } from "./InstituteBenefits";
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { Icon } from "../../pages/_New/Teach";
import { IconBrandFacebook, IconBrandWhatsapp, IconMail, IconMessage2 } from "@tabler/icons";
import { convertToHyphenSeparated, sendMessage } from "../../utilities/HelperFunctions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GetUser } from "../../utilities/LocalstorageUtility";
import { DashBoardSection } from "../AdminPage/DashBoard/DashBoard";


export function WebsiteBuilder(props: {
  instituteDetails: InstituteWebsiteDisplay;
  reloadInstituteData: () => void;
  setIsLoading: (val: boolean) => void;
  setSelectedSection: (val: DashBoardSection) => void;
  setSelectedNotice: (val: Notice) => void;
}) {
  const theme = useMantineTheme();
  const isMd = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const isXl = useMediaQuery(`(max-width: ${theme.breakpoints.xl}px)`);
  const [isShareClicked,setIsShareClicked] =useState<boolean>(false);

  useEffect(() => {
    Mixpanel.track(WebAppEvents.DASHBOARD_WEBSITE_BUILDER_ACCESSED);
  }, []);

  function getParentURL() {
    const currentUrl = window.location.href;
    const urlParts = new URL(currentUrl);
    const user = GetUser();
    const base = urlParts.origin;
    const modifiedUrl = `${base}/${convertToHyphenSeparated(
      user.instituteName
    )}/${user.instituteId}/home`;
    return modifiedUrl;
  }

  return (
    <>
    <Stack>
        <TopBar
        setSelectedSection={props.setSelectedSection}
        theme={props.instituteDetails.theme}
        instituteId={props.instituteDetails._id}
        setIsLoading={props.setIsLoading}
        reloadInstituteData={props.reloadInstituteData}
      />
      <Center w={"100%"} bg={"#f7f7ff"} pb={60} pt={10}>
        <Stack maw={"1000px"} w={"90%"} spacing={isMd ? 30 : 60}>
          <HeroSectionEdit
          Alignment = {props.instituteDetails.Alignment || ""}
          Layout = {props.instituteDetails.Layout ||""}
            heroImage={props.instituteDetails.heroSection.heroImage}
            heading={props.instituteDetails.heroSection.heading}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
          />
          <NoticesEdit
            notices={props.instituteDetails.notices}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
            setSelectedNotice={props.setSelectedNotice}
            setSelectedSection={props.setSelectedSection}
          />
          <AboutUsEdit
            instituteName={props.instituteDetails.name}
            aboutUs={props.instituteDetails.aboutUs}
            aboutUsDetails={props.instituteDetails.aboutUsDetails}
            aboutUsImages={props.instituteDetails.aboutUsImages}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
            instituteDetail = {props.instituteDetails}
          />
          <OurFacilitiesEdit
            facilities={props.instituteDetails.facilities}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
          />
          <InstituteBenefitsEdit
            benefits={props.instituteDetails.instituteBenefits}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
            instituteBenefitsTagLine={
              props.instituteDetails.instituteBenefitsTagLine
            }
          />
          <TestimonialsEdit
            instituteId={props.instituteDetails._id}
            testimonials={props.instituteDetails.testimonials}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
          />
          <GalleryEdit
            setIsLoading={props.setIsLoading}
            instituteId={props.instituteDetails._id}
            reloadInstituteData={props.reloadInstituteData}
            gallerySections={props.instituteDetails.gallerySections}
          />
          <OurTeamEdit
            teamMembers={props.instituteDetails.teamMembers}
            setIsLoading={props.setIsLoading}
            instituteId={props.instituteDetails._id}
            reloadInstituteData={props.reloadInstituteData}
            teamMemberType={TeamMemberstype.TeamMembers}
            title="Add Faculty Members"
          />
          <OurTeamEdit
            teamMembers={props.instituteDetails.coreTeamMembers}
            setIsLoading={props.setIsLoading}
            instituteId={props.instituteDetails._id}
            reloadInstituteData={props.reloadInstituteData}
            teamMemberType={TeamMemberstype.CoreTeamMembers}
            title="Add Core Team Members"
          />
          <OurTeamEdit
            teamMembers={props.instituteDetails.topperStudents}
            setIsLoading={props.setIsLoading}
            instituteId={props.instituteDetails._id}
            reloadInstituteData={props.reloadInstituteData}
            teamMemberType={TeamMemberstype.TopperStudents}
            title="Add Student"
          />
          <FooterEdit
            footerDescription={props.instituteDetails.footerDescription}
            email={props.instituteDetails.instituteEmail}
            phoneNumber={props.instituteDetails.institutePhoneNumber}
            secondPhoneNumber={props.instituteDetails.secondInstituteNumber}
            instituteAddress={props.instituteDetails.Address}
            secondinstituteAddress={props.instituteDetails.secondAddress}
            instituteId={props.instituteDetails._id}
            setIsLoading={props.setIsLoading}
            reloadInstituteData={props.reloadInstituteData}
            instagramLink={props.instituteDetails.instagramLink}
            youtubeLink={props.instituteDetails.youtubeLink}
            facebookLink={props.instituteDetails.facebookLink}
          />
        </Stack>
        <Modal
        opened={isShareClicked}
        onClose={() => {
          setIsShareClicked(false);
        }}
        zIndex={999}
        title="Share Website Link"
        centered
      >
        <Stack>
          <Flex>
            <FacebookShareButton url={getParentURL()}>
              <Icon
                name="Facebook"
                icon={<IconBrandFacebook color="white" />}
                onClick={() => {}}
                color="#1776F1"
              />
            </FacebookShareButton>

            <WhatsappShareButton url={getParentURL()}>
              <Icon
                name="Whatsapp"
                icon={<IconBrandWhatsapp color="white" />}
                onClick={() => {}}
                color="#43C553"
              />
            </WhatsappShareButton>

            <EmailShareButton url={getParentURL()}>
              <Icon
                name="Email"
                icon={<IconMail color="white" />}
                onClick={() => {}}
                color="#E0534A"
              />
            </EmailShareButton>
            <Icon
              name="Message"
              icon={<IconMessage2 color="white" />}
              onClick={() => {
                sendMessage(getParentURL());
              }}
              color="#0859C5"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <TextInput
              style={{
                marginRight: "5px",
                height: "40px",
                width: "95%",
              }}
              value={getParentURL()}
            >
            </TextInput>
            <CopyToClipboard text={getParentURL()}>
              <Button
                bg="#3174F3"
                style={{
                  borderRadius: "20px",
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Flex>
        </Stack>
      </Modal>
      </Center>
      </Stack>
    </>
  );
  
}

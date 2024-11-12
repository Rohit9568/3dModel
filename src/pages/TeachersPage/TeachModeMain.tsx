import { useParams } from "react-router-dom";
import ModifiedOptionsSim from "../../components/_New/NewPageDesign/ModifiedOptionsSim";
import { Allsimulations } from "../AllSimulations/AllSimulations";
import useFeatureAccess from "../../hooks/useFeatureAccess";

export function TeacherModeMAin(props: {
  featureAccess: AppFeaturesAccess;
  logout: () => void;
}) {
  const params = useParams();
  const screen = params.screen;
  const { isFeatureValidwithNotification, UserFeature } = useFeatureAccess();

  return (
    <>
      {props.featureAccess.simualtionAccess === true &&
        props.featureAccess.teachContentAccess === false && <Allsimulations />}
      {props.featureAccess.teachContentAccess === true && (
        <>
          {screen && screen === "chapterSelect"}
          {screen && screen === "study" && (
            <ModifiedOptionsSim
              showSimulations={props.featureAccess.simualtionAccess}
            />
          )}
          {screen && screen === "simulations" && <Allsimulations />}
          {!screen && (<></>)}
        </>
      )}
    </>
  );
}

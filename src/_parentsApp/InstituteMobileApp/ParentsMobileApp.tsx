import { useNavigate, useParams } from "react-router";
import {
  GetValueFromLocalStorage,
  LocalStorageKey,
} from "../../utilities/LocalstorageUtility";
import { StudentAuthorization } from "../features/instituteStudentSlice";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { LoginUsers } from "../../components/Authentication/Login/Login";
import { GetAllInfoForInstitute } from "../features/instituteSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/ReduxStore";
import { instituteDetails } from "../../store/instituteDetailsSlice";
import { InstituteLoginPage } from "./InstituteLoginPage";
import useParentCommunication from "../../hooks/useParentCommunication";
import { ParentsAppMain } from "../ParentsAppMain";
const instituteDetailsActions = instituteDetails.actions;

export function ParentsMobileApp() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const instituteId = params.id;
  const instituteName = params.Institutename;
  const token = GetValueFromLocalStorage(LocalStorageKey.Token);
  const userType = GetValueFromLocalStorage(LocalStorageKey.UserType);
  const [error, setError] = useState<string | null>(null);

  const { isReactNativeActive } = useParentCommunication();

  useEffect(() => {
    if (
      token &&
      (userType === LoginUsers.TEACHERADMIN ||
        userType === LoginUsers.ADMINISTRATOR ||
        userType === LoginUsers.TEACHER ||
        userType === LoginUsers.ADMIN ||
        userType === LoginUsers.OWNER)
    ) {
      navigate(`/`);
    } else if (token) {
      navigate(`/${instituteName}/${instituteId}/home`);
    }
  }, [userType, token]);

  useEffect(() => {
    if (instituteId) {
      GetAllInfoForInstitute({ id: instituteId })
        .then((x: any) => {
          dispatch(
            instituteDetailsActions.setDetails({
              name: x.name,
              iconUrl: x.schoolIcon,
              _id: x._id,
              secondPhoneNumber: x.secondInstituteNumber,
              address: x.Address,
              phoneNumber: x.institutePhoneNumber,
              featureAccess: x.featureAccess,
              paymentDetailsImageUrl: x.paymentDetailsImageUrl,
            })
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [instituteId]);

  if (!token)
    return (
      <>
        <InstituteLoginPage />
      </>
    );
  return <></>;
}

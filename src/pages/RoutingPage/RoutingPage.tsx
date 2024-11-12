import { Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginUsers } from "../../components/Authentication/Login/Login";
import { fetchClassAndSubjectList } from "../../features/UserSubject/TeacherSubjectSlice";
import {
  GetUser,
  GetValueFromLocalStorage,
  LocalStorageKey,
} from "../../utilities/LocalstorageUtility";
import { AuthenticationPage } from "../AuthenticationPage/AuthenticationPage";
import { RootState } from "../../store/ReduxStore";
import { User, User1 } from "../../@types/User";
import { useSelector } from "react-redux";
import { getUserById } from "../../features/user/userSlice";
interface ApiResponseClasses {
  chaptersCount: number;
  classId: string;
  className: string;
  classSortOrder: number;
  name: string;
  subjectId: string;
  _id: string;
}
export function RoutingPage() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const value = GetValueFromLocalStorage(LocalStorageKey.UserType);
  const user = GetUser();
  const location = useLocation();
  // const user = useSelector<RootState, User1 | null>((state) => {
  //   return state.currentUser.user;
  // });

const params = new URLSearchParams(location.search);
const sim_id = params.get('sim_id');
const dataFromState = location.state && location.state.data;
  useEffect(() => {
    if (user) {
      let user1: any = null;
      getUserById(user._id)
        .then((x: any) => {
          user1 = x;
          if (user && user.instituteId && user.instituteName) {
            if(sim_id && dataFromState){
              navigate(`/${user.instituteName}/${user.instituteId}/teach1/all simulations/simulation/${sim_id}`, {state: {data: dataFromState}});
            }else if(sim_id && !dataFromState){
              navigate(`/${user.instituteName}/${user.instituteId}/teach1/all simulations/simulation/${sim_id}`);
            }else if(!sim_id){
              navigate(`/${user.instituteName}/${user.instituteId}/teach1/dashboard`);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setIsChecked(true);
    }
  }, []);
  return (
    <Group>
      <div>
        {isChecked === true && (
          <AuthenticationPage
            onLoginSuccess={() => {
              window.location.reload();
            }}
            isTeacherLogin={true}
          />
        )}
      </div>
    </Group>
  );
}

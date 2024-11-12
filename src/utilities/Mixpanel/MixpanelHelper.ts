import mixpanel from "mixpanel-browser";
import { GetUser, GetValueFromLocalStorage, LocalStorageKey } from "../LocalstorageUtility";

let token: string = process.env.REACT_APP_MIXPANEL_TOKEN ?? "";

mixpanel.init(token, { ignore_dnt: true });

let actions = {
  track: (name: string, props?: any) => {
    mixpanel.track(name, props);
  },
  registerFromLocalStorage: () => {
    let user = GetUser();
    if (user != null) {
      user.userType=GetValueFromLocalStorage(LocalStorageKey.UserType);
      mixpanel.identify(user._id);
      mixpanel.register(user);
      mixpanel.people.set(user);
    }
  },
  register: (user:any) => {
    // let user = GetUser();
    if (user != null) {
      const user1={...user,userType:user.role}
      // user.userType=GetValueFromLocalStorage(LocalStorageKey.UserType);
      mixpanel.identify(user1._id);
      mixpanel.register(user1);
      mixpanel.people.set(user1);
    }
  },
  registerParentFromLocalStorage:(data:any,schoolName:string)=>{
    const userData={
      _id:`PAR-${data[0].phoneNumber}`,
      name:data[0].parentName,
      instituteId:data[0].instituteId,
      phone:data[0].phoneNumber,
      userType:'PARENT',
      instituteName:schoolName,
      isOrganic:data[0].isOrganic
    }
    mixpanel.identify(userData._id);
    mixpanel.register(userData);
    mixpanel.people.set(userData);
  },
  logout:()=>{
    mixpanel.reset();
  }
};

export let Mixpanel = actions;

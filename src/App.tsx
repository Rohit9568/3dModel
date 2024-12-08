import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { LoadingSimulation } from "./pages/SimulationPage/LoadingSimulation";
import { store } from "./store/ReduxStore";

import { NotificationsProvider } from "@mantine/notifications";
import { useEffect } from "react";
import { ParentsAppMain } from "./_parentsApp/ParentsAppMain";
import ErrorBoundary from "./components/ErrorBoundry/ErrorBoundry";
import { UserDetails } from "./components/UserDetails/UserDetails";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { RoutingPage } from "./pages/RoutingPage/RoutingPage";
import { TeacherAddSimulationPage } from "./pages/TeacherAddSimulationPage/TeacherAddSimulationPage";
import { AddSubjectPage } from "./pages/TeacherAddSubjectPage/AddSubjectPage";
import { WebAppEvents } from "./utilities/Mixpanel/AnalyticeEventWebApp";
import { Mixpanel } from "./utilities/Mixpanel/MixpanelHelper";
// import SearchPage from "./components/_New/NewPageDesign/SearchPage";
import { ParentsMobileApp } from "./_parentsApp/InstituteMobileApp/ParentsMobileApp";
import { LandingPage } from "./pages/LandingPage";
import { OnBoarding } from "./pages/onBoarding/Onboarding";
import { SearchPage2 } from "./pages/SearchPage/SearchPage2";
import { LoadingMySimulationwithData } from "./pages/SimulationPage/LoadingMySimulationwithData";
import { UnityMegaSimulation } from "./pages/SimulationPage/UnityMegaSimulation";
import { VideoCallStartPage } from "./pages/VideoCallStartPage";
import PrivacyPolicyScreen from "./pages/PrivacyPolicy";
import RefundPolicyScreen from "./pages/RefundPolicy";
import TermsScreen from "./pages/TermsofUse";
import AnatomyModelSimulation from "./components/MegaModels/AnatomyModel/AnatomyModelSimulation";
import { BarElement } from "chart.js";
import SlicerModelSimulation from "./components/SlicerModel/SlicerModelSimulation";
import VectorModelSimulation from "./features/vectorModelSimulations/VectorModelSimulation";
import TrigonometryModelSimulation from "./components/TrigoModels/TrigonometryModelSimulation";
import DetailModel from "./components/MegaModels/AnatomyModel/DetailModel";
import OpticsModelSimulation from "./components/opticsSimulation/OpticsModelSimulation";
const router = createBrowserRouter(
  [
    
    {
      path: "/onboarding",
      element: <OnBoarding />,
    },
    {
      path: "/teach",
      element: <RedirectfromTeach />,
    },
    {
      path: "/simulation/play/:id",
      element: <LoadingSimulation />,
    },
    {
      path: "/mysimulation/play/:id",
      element: <LoadingMySimulationwithData />,
    },
    {
      path: "/megasimulation/:chapterId",
      element: <UnityMegaSimulation />,
    },
    {
      path: "/vector",
      element: <VectorModelSimulation />
    },
    {
      path: "/trigo",
      element: <TrigonometryModelSimulation />
    },
    {
      path: "/OpticsMega",
      element: <OpticsModelSimulation />,
    },
    {
      path: "/teacher/add",
      element: <AddSubjectPage />,
    },
    {
      path: "/teacher/simulations/:page/:subjectId/:chapterId/:topicId/add/:type",
      element: <TeacherAddSimulationPage />,
    },
    {
      path: "/:Institutename/:id/home",
      element: <ParentsAppMain />,
    },
    {
      path: "/:Institutename/:id/home/:entryComponent",
      element: <ParentsAppMain />,
    },
    {
      path: "/:Institutename/:id/home/:entryComponent/:subComponent",
      element: <ParentsAppMain />,
    },
    {
      path: "/:Institutename/:id/home/:entryComponent/:subComponent/:chapterId/",
      element: <ParentsAppMain />,
    },
    {
      path: "/:Institutename/:id/home/:entryComponent/:subComponent",
      element: <ParentsAppMain />,
    },

    {
      path: "/:Institutename/:id/parent",
      element: <ParentsMobileApp />,
    },
    {
      path: "/:Institutename/:id/parent/:entryComponent",
      element: <ParentsMobileApp />,
    },
    {
      path: "/:Institutename/:id/parent/:entryComponent/:subComponent",
      element: <ParentsMobileApp />,
    },
    {
      path: "/:Institutename/:id/parent/:entryComponent/:subComponent/:chapterId/",
      element: <ParentsMobileApp />,
    },
    {
      path: "/:Institutename/:id/parent/:entryComponent/:subComponent",
      element: <ParentsMobileApp />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/search",
      element: <SearchPage2 />,
    },
    {
      path: "/videoCall/:id",
      element: <VideoCallStartPage />,
    },
    {
      path: "/:Institutename/:id/teach1",
      element: <LandingPage />,
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId/simulation/anatomymodelsimulation",
      element: <AnatomyModelSimulation />
    },
    {
      path: '/:Institutename/:id/teach1/:navbarId/simulation/anatomymodelsimulation/:modelId',
      element: <DetailModel />
    },
    {
      path: '/:Institutename/:id/teach1/:navbarId/simulation/Anatomy3DBuilderMega',
      element: <SlicerModelSimulation />
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId",
      element: <LandingPage />,
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId/:screen",
      element: <LandingPage />,
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId/:screen/:subjectId",
      element: <LandingPage />,
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId/:screen/:subjectId/:chapterId",
      element: <LandingPage />,
    },
    {
      path: "/:Institutename/:id/teach1/:navbarId/:screen/:subjectId",
      element: <LandingPage />,
    },
    {
      path: "/privacypolicy/:instituteName",
      element: <PrivacyPolicyScreen />,
    },
    {
      path: "/privacypolicy/",
      element: <PrivacyPolicyScreen />,
    },
    {
      path: "/refundpolicy",
      element: <RefundPolicyScreen />,
    },
    {
      path: "/termsofuse",
      element: <TermsScreen />,
    },
  ].map((route) => ({
    ...route,
    element: (
      <ErrorBoundary>
        <UserDetails>{route.element}</UserDetails>
      </ErrorBoundary>
    ),
  }))
);

export default function App() {
  useEffect(() => {
    Mixpanel.track(WebAppEvents.VIGNAM_APP_LAUNCHED);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "Nunito,Poppins,Greycliff CF, Verdana, sans-serif",
        fontFamilyMonospace: "Greycliff CF, Monaco, Courier, monospace",
        breakpoints: {
          xs: 320,
          sm: 480,
          md: 768,
          lg: 1024,
          xl: 1440,
        },
        headings: {
          fontWeight: 400,
          fontFamily: "Nunito,Poppins,Greycliff CF, sans-serif",
        },
        components: {
          Modal: {
            defaultProps: {
              closeOnClickOutside: false,
            },
          },
        },
      }}
    >
      <NotificationsProvider position="top-center" zIndex={99999}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

function RedirectfromTeach() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return <></>;
}

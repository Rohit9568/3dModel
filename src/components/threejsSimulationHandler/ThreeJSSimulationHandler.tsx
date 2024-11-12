import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { GetUserToken } from '../../utilities/LocalstorageUtility';


interface threejsSimulationHandlerProps {
  sim_id: string;
  data: {} | null;
}

const ThreeJSSimulationHandler = ({sim_id, data}:threejsSimulationHandlerProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (sim_id) {
            const token = GetUserToken();
            if(!token){
              if(data ! == null){
                navigate(`/?sim_id=${sim_id}`);
              }else {
                navigate(`/?sim_id=${sim_id}`, {state: { data: data}});
              }
            }
            }
      }, [sim_id]);

      return (
        <></>
      )
}

export default ThreeJSSimulationHandler;
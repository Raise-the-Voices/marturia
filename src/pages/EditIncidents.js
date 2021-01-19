import React, {useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom'
import MainLayout from '../components/MainLayout';
import IncidentForm from '../components/IncidentForm';
import { tokenIsStillValid } from "../utils/utils";
import './Submit.scss';


const Submit = (props) => {
	
  const { register, errors, setValue } = useForm()
  
  useEffect(() => {
    document.title = 'Edit Incidents - Testimony Database'
		
  }, []);

  if(!tokenIsStillValid()) {
    return <Redirect to='/login'/>
  }

  return (
    <MainLayout>	
      <div className="submit page">
        <div className="wrapper">
       <form>
			 <IncidentForm victimId={props.match.params.id} editMode={true} register={register} setValue={setValue} errors={errors}/>
             </form>         
		  
        </div>
      </div>


    </MainLayout>
	

  );
};

export default Submit;

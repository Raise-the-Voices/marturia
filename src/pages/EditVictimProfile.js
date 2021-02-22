import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import MainLayout from '../components/MainLayout';
import { tokenIsStillValid, getMMDDYYYYfromISO } from "../utils/utils";
import { authContentTypeHeaders } from '../actions/headers';
import { constructReportInfoObj, constructVictimProfileObj, uploadProfilePhoto } from '../actions/submit';
import data from '../data/countries.json';
import './Submit.scss';

const Submit = (props) => {
	const [statusWithoutAll, setOption] = useState(null);
  const [reportID, setreportID] = useState(null);

  //state variables to record whether modal component is shown and which popup message to display
  const [submitting, setSubmitting] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState("");
  
  useEffect(() => {
    document.title = 'Edit Victim Profile - Testimony Database';

    Promise.all([
			fetch(process.env.REACT_APP_API_BASE + 'options', {
				method: "GET",
			}),
			fetch(process.env.REACT_APP_API_BASE + 'victims?idvictim=' + props.match.params.id, {
        method: "GET",
        headers: authContentTypeHeaders()
			}),
			fetch(process.env.REACT_APP_API_BASE + 'reports?victimID='+ props.match.params.id,{
        method: "GET",
        headers: authContentTypeHeaders()
			})
		]).then(function (responses) {
			// Get a JSON object from each of the responses
			return Promise.all(responses.map(function (response) {
				return response.json();
			}));
		}).then(function (data) {
			// console.log(data);

			//data[0]
			setOption(data[0]['options-list'].filter(option => option.group === 'current_status'));

			//data[1]
      if(data[1].status === 200) {
        setValue("victim_name",        data[1].victim.name);
        setValue("legal_name",         data[1].victim.legal_name);
        setValue("aliases",            data[1].victim.aliases);
        setValue("gender",             data[1].victim.gender);
        setValue("place_of_birth",     data[1].victim.place_of_birth );
        data[1].victim["date_of_birth"] === null? setValue("birth_date",""): setValue("birth_date", getMMDDYYYYfromISO(data[1].victim["date_of_birth"]));
        setValue("country",            data[1].victim.country);
        data[1].victim["last_seen_date"] === null? setValue("detainment_datey",""): setValue("detainment_date", getMMDDYYYYfromISO(data[1].victim["last_seen_date"]));
        setValue("detainment_location",data[1].victim.last_seen_place);
        setValue("status",             data[1].victim["current_status"]);
      }
      setPhotoUploaded(data[1].victim.profile_image_url);

      //data[2] 
      if(data[2].status === 200) {
        setValue("name", data[2].report.name_of_reporter);
        setValue("email", data[2].report.email_of_reporter);
        setValue("discovery", data[2].report.discovery);
        data[2].report.is_direct_testimony === false? setValue("own_testimony","no"): setValue("own_testimony","yes");
      }
      setreportID(data[2].report.ID);

		}).catch(function (error) {
      // if there's an error, log it
      alert('something went wrong');
			// console.log(error);
    });
    
	}, []);

	const { register, errors, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      discovery:"",
      own_testimony:"no",
      victim_name:  "",
      legal_name: "",
      aliases:"",
      gender:"",
      place_of_birth: "",
      birth_date:"",
      country: "",
      detainment_date: "",
      detainment_location:"",
      status:"",
      photo:""
    }
  })

  if(!tokenIsStillValid()) {
    return <Redirect to='/login'/>
  }

	const handleFormSubmit = (form) => {
    setSubmitting(true)
    let reportObj = constructReportInfoObj(form);
    let victimProfileObj = constructVictimProfileObj(form);

    Promise.all([
      fetch(process.env.REACT_APP_API_BASE + 'victims/' + props.match.params.id, {
        method: "PUT",
        headers: authContentTypeHeaders(),
        body: JSON.stringify(victimProfileObj)
      }),
      fetch(process.env.REACT_APP_API_BASE + 'reports/' + reportID, {
        method: "PUT",
        headers: authContentTypeHeaders(),
        body: JSON.stringify(reportObj)
      }),
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {
      // console.log(data)	;		
			if(data[0].status === 200 && data[1].status === 200) {

			 	uploadProfilePhoto(form.photo, props.match.params.id, () => {
          // console.log("upload finished");
          props.history.push('/view/'+props.match.params.id);
        }).then( () =>{ props.history.push('/view/'+props.match.params.id)} );			
			} else {
				alert('something went wrong')
			}
		})
		.catch(err => console.log(err))
	};

  const SendingModal = () => {
    return (
      <Popup modal closeOnDocumentClick	open={submitting && (!photoUploaded) }>
        <div className="modal">
          Submitting ...
        </div>
      </Popup>
    )
  }
  
  // deleteVictimPhoto
  const deleteVictimPhoto = (victimID) => {
    return fetch(process.env.REACT_APP_API_BASE + 'victims/profile-img/' + String(victimID), {
      method: "DELETE",
    })
    .then(res => res.json())
    .then((result) => { 
      if (result.status === 200) {
        setPhotoUploaded("");
      }
      return alert(result.message);
    })
    .catch(function(err) {alert('something went wrong'); console.log(err);})
  };

  return (
    <MainLayout>	
      <div className="submit page">
        <div className="wrapper">
        <h2 className="title-edit">Edit Victim Profile</h2>	
					<form onSubmit={handleSubmit(handleFormSubmit)}>
            <section>
              <h1>Your information</h1>					
              <div className="row">
                <label htmlFor="name">Name*</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  ref={(input) => {
                    register(input, { required: true });
                  }}
                />
                {errors.name &&
                  <p className="error">Name is required</p>}
              </div>
              <div className="row">
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  ref={register({ required: true })}
                />
                {errors.email &&
                  <p className="error">Email is required</p>}
              </div>
              <div className="row">
                <label htmlFor="discovery">Discovery*</label>
                <textarea
                  id="discovery"
                  name="discovery"
                  placeholder="How you learned about the victim's status."
                  ref={register({ required: true })}
                />
                {errors.discovery &&
                  <p className="error">Discovery is required</p>}
              </div>
              <div className="row radio">
                <label>Is this your testimony?*</label>
                <div className="radio-buttons">
                  <label className="radio-label">
                    <input
                      name="own_testimony"
                      type="radio"
                      value="yes"
                      ref={register({ required: true })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-label">
                    <input
                      name="own_testimony"
                      type="radio"
                      value="no"
                      defaultChecked
                      ref={register({ required: true })}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.own_testimony &&
                  <p className="error radio">This field is required</p>}
              </div>
            </section>
            <section>
              <h1>Victim's information</h1>
              <div className="row">
                <label htmlFor="victim_name">Name*</label>
                <input
                  id="victim_name"
                  name="victim_name"
                  type="text"
                  ref={register({ required: true })}
                />
                {errors.victim_name &&
                  <p className="error">Victim's name is required</p>}
              </div>
			   			<div className="row">
                <label htmlFor="victim_name">Legal Name</label>
                <input
                  id="legal_name"
                  name="legal_name"
                  type="text"
                  ref={register({ required: false })}
                />
              </div>
			  			<div className="row">
                <label htmlFor="victim_name">Aliases</label>
                <input
                  id="aliases"
                  name="aliases"
                  type="text"
                  ref={register({ required: false })}
                />
              </div>
			  			<div className="row">
                <label htmlFor="gender">Gender</label>
                <select
								  id="gender"
								  name="gender"
								  ref={register({ required: false })}>
                  {['M','F'].map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
			  			<div className="row">
                <label htmlFor="gender">Place of Birth</label>
                <input
                  id="place_of_birth"
                  name="place_of_birth"
                  ref={register({ required: false })}
                />
              </div>
							<div className="row">
                <label htmlFor="birth_date">Date of Birth (Skip if unknown)</label>
                <input type="date"
											 id="birth_date"
											 name="birth_date"
											 ref={register({ required: false })}/>
              </div>
              <div className="row">
                <label htmlFor="country">Country*</label>
                <select defaultValue={"country"}
												id="country"
												name="country"
												ref={register({ required: true })}>
									{data.countries.map(item => (
										<option
											key={item.country}
											value={item.country}>
											{item.country}
										</option>
									))} 
                </select>
              	{errors.country &&
									<p className="error">Country is required</p>}
              </div>
			  			<div className="row">
                <label htmlFor="detainment_date">Last Seen Date (Skip if unknown)</label>
                <input type="date"
											 id="detainment_date"
											 name="detainment_date"
											 ref={register({ required: false })}/>
              </div>
              <div className="row">
                <label htmlFor="detainment_location">Last Seen Place</label>
                <textarea
                  id="detainment_location"
                  name="detainment_location"
                  placeholder="Location where victim was seen the last time.  Enter unknown if you don't know."
                  ref={register({ required: false })}
                />
              </div>
              <div className="row">
                <label htmlFor="status">Current Status</label>
								<select defaultValue={"status"}
									id='status'
									name='status'
									ref={register({ required: false })}>
								{statusWithoutAll?.map(item => (
									<option
										key={item.title}
										value={item.title}>
										{item.title}
									</option>
								))}
								</select>
              </div>
              {  photoUploaded !== "" ? 
                <div className="row">
                  <img className="photo" src={photoUploaded} alt="victim-pic"/>
                  <button type="button" className="btn" onClick={() => deleteVictimPhoto(props.match.params.id)}>Delete Photo</button>
                </div>
                : 
                <div className="row">
                  <label htmlFor="photo">Victim's Photo</label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/gif"
                    ref={register({ required: false })}
                  />
                </div>
              }
              <div className="row">
                <button type="button" className="btn" onClick={handleSubmit(handleFormSubmit)}>Submit</button>
              </div>
            </section>
          </form>
          <SendingModal />
        </div>
      </div>
    </MainLayout>
  );
};

export default Submit;

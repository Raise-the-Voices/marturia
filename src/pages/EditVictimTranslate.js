import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import MainLayout from '../components/MainLayout';
import { tokenIsStillValid } from "../utils/utils";
import { authContentTypeHeaders } from '../actions/headers';
import { constructSubmitVictimTranslateObjt } from '../actions/submit';
import './Submit.scss';

const EditVictimTranslate = (props) => {
  const [translate, setTranslate] = useState(false);
  //state variables to record whether modal component is shown and which popup message to display
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Edit Victim Translate - Testimony Database';

    Promise.all([
			fetch(process.env.REACT_APP_API_BASE + 'victim-translations?idvictim-translation=' + props.match.params.victranslid, {
        method: "GET"
			}),
		]).then(function (responses) {
			// Get a JSON object from each of the responses
			return Promise.all(responses.map(function (response) {
				return response.json();
			}));
		}).then(function (data) {
			// console.log(data);

			//data[0]
      if(data[0].status === 200) {
        setValue("language",        data[0].translation.language);
        setValue("health_status",         data[0].translation.health_status);
        setValue("health_issues",            data[0].translation.health_issues);
        setValue("languages_spoken",             data[0].translation.languagues_spoken);
        setValue("profession",     data[0].translation.profession );
        setValue("about",data[0].translation.about_the_victim);
        setValue("additional",             data[0].translation.additional_information);
      }
      setTranslate(data[0].translation);

		}).catch(function (error) {
      // if there's an error, log it
      alert('something went wrong');
			// console.log(error);
    });
    
  }, []);
  
  const { register, errors, handleSubmit, setValue } = useForm({
    defaultValues: {
      language: "",
      health_status: "",
      health_issues:"",
      languages_spoken:"",
      profession:  "",
      about: "",
      additional:"",
    }
  })

  if(!tokenIsStillValid()) {
    return <Redirect to='/login'/>
  }

  const handleFormSubmitToEdit = (form) => {
    setSubmitting(true)
    form.language = translate.language;
    let victimProfileObj = constructSubmitVictimTranslateObjt(form);

    Promise.all([ 
      fetch(process.env.REACT_APP_API_BASE + 'victim-translations/' + props.match.params.victranslid , {
        method: "PUT",
        headers: authContentTypeHeaders(),
        body: JSON.stringify(victimProfileObj)
      }),
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {		

			if(data[0].status === 200) {
        // console.log(data[0]);
        return props.history.push('/view/'+ translate.victimid);
			// 
			} else {
				alert('something went wrong')
			}
		})
		.catch(err => console.log(err))
	};

  const SendingModal = () => {
    return (
      <Popup modal closeOnDocumentClick	open={submitting}>
        <div className="modal">
          Submitting ...
        </div>
      </Popup>
    )
  }

  return (
    <MainLayout>	
      <div className="submit page">
        <div className="wrapper">
          <h2 className="title-edit">Edit a Translation</h2>	
					<form onSubmit={handleSubmit(handleFormSubmitToEdit)}>
            <section>

              <div className="row">
                <label htmlFor="health_status">Health Status</label>
                <input
                  id="health_status"
                  name="health_status"
                  type="text"
                  ref={(input) => {
                    register(input, { required: true });
                  }}
                />
                {errors.health_status &&
                  <p className="error">Health Status is required</p>}
              </div>

              <div className="row">
                <label htmlFor="health_issues">Health Issues</label>
                <textarea
                  id="health_issues"
                  name="health_issues"
                  placeholder="List known health issues of the victim."
				          ref={register({ required: false })}
                />
              </div>

              <div className="row">
                <label htmlFor="languages_spoken">Languages Spoken</label>
                <textarea
                  id="languages_spoken"
                  name="languages_spoken"
                  placeholder="List known health issues of the victim."
				          ref={register({ required: false })}
                />
              </div>

              <div className="row">
                <label htmlFor="profession">Profession</label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  ref={(input) => {
                    register(input, { required: false });
                  }}
                />
              </div>

              <div className="row">
                <label htmlFor="about">About</label>
                <textarea
                  id="about"
                  name="about"
                  placeholder="Short biography of the victim, including ethnicity or age range, if known."
                  ref={register({ required: false })}
                />
              </div>

              <div className="row">
                <label htmlFor="additional">Additional Information</label>
                <textarea
                  id="additional"
                  name="additional"
                  placeholder="Any additional information."
				          ref={register({ required: false })}
                />
              </div>

              <div className="row">
                <button type="button" className="btn" onClick={handleSubmit(handleFormSubmitToEdit)}>Submit</button>
              </div>
            </section>
          </form>
          <SendingModal />
        </div>
      </div>
    </MainLayout>
  );
};

export default EditVictimTranslate;
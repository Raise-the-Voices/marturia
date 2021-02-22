import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import Popup from 'reactjs-popup';
import MainLayout from '../components/MainLayout';
import { tokenIsStillValid } from "../utils/utils";
import { langs } from '../data/languages.js';
import { authContentTypeHeaders } from '../actions/headers';
import { constructSubmitVictimTranslateObjt } from '../actions/submit';
import './Submit.scss';

const SubmitVictimTransl = (props) => {
  //state variables to record whether modal component is shown and which popup message to display
  const [submitting, setSubmitting] = useState(false);

  const { register, errors, handleSubmit } = useForm({
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

  const handleFormSubmit = (form) => {
    setSubmitting(true)
    let victimProfileObj = constructSubmitVictimTranslateObjt(form);

    Promise.all([ 
      fetch(process.env.REACT_APP_API_BASE + 'victims/' + props.match.params.id +'/victim-translations', {
        method: "POST",
        headers: authContentTypeHeaders(),
        body: JSON.stringify(victimProfileObj)
      }),
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {		
			if(data[0].status === 201) {
        console.log(data[0]);
        return props.history.push('/view/'+props.match.params.id);
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
          <h2 className="title-edit">Submit a translation to Victim Profile</h2>	
					<form onSubmit={handleSubmit(handleFormSubmit)}>
            <section>

			        <div className="row">
			  				<label htmlFor="language">Language</label>
                <select
								  id="language"
								  name="language"
								  ref={register({ required: true })}>
                  {langs.map((item) => (
                  <option
                    key={item.code + item.name}
                    value={item.code}>
                    {item.name}
                  </option>
                ))}
                </select>
                {errors.language &&
                  <p className="error">Language is required</p>}
              </div>

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
                  placeholder="Languages Spoken."
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

export default SubmitVictimTransl;
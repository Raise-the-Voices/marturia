import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import VictimMedia from '../components/VictimMedia';
import { langs } from '../data/languages.js';
import { convertMonthtoStringFormat, tokenIsStillValid }from '../utils/utils.js';
import { authContentTypeHeaders } from '../actions/headers';
import { constructIncidentTranslationObj } from '../actions/submit';
import './ViewComponent.scss';
import '../pages/View.scss';
import '../pages/Submit.scss';

const IncidentItem = (props) => {
	const [FormSubmit, setFormSubmit] = useState(false);

	const [incTranslations, setIncTranslations] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [medias, setMedias] = useState(null);

	const { register, errors, handleSubmit } = useForm({
    defaultValues: {
      language: "",
      incident_narrative: "",
    }
	})
	
	useEffect(() => {

		fetch(process.env.REACT_APP_API_BASE + 'incident-translations?idincident=' + String(props.data.ID))
		.then(res => res.json())
		.then(data => {
			if(data.status === 200) {
				setIncTranslations(data.translations)
				setIsLoaded(true);
			} else if(data.status === 400) {
				//params error
			} else {
				//something went wrong
			}
		})
		.catch(err => console.log(err))

		fetch(process.env.REACT_APP_API_BASE + 'incident-medias?idincident=' + String(props.data.ID), {
		  headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 200) {
				//console.log(data)
				setMedias(data.medias)
			} else if(data.status === 400) {
				//params error
			} else {
				//something went wrong
			}
		})
		.catch(err => console.log(err))
	}, [])

	const handleButtonToDeleteIncidTransl = (inciTranslID) => {
		fetch(process.env.REACT_APP_API_BASE + 'incident-translations/' + String(inciTranslID), {
			method: "DELETE",
			headers: authContentTypeHeaders()
    })
    .then(res => res.json())
    .then((result) => { 
      if (result.status === 200) {
				setIncTranslations(incTranslations.filter(trans => trans.ID !== inciTranslID));
      }
      return alert(result.message);
    })
    .catch(function(err) {alert('something went wrong'); console.log(err);})
	};

	const handleFormSubmit = (form) => {
    let incidentTranslateObj = constructIncidentTranslationObj(form);

		fetch(process.env.REACT_APP_API_BASE + 'incidents/' + String(props.data.ID) +'/incident-translations', {
			method: "POST",
			headers: authContentTypeHeaders(),
			body: JSON.stringify(incidentTranslateObj)
		})
		.then(res => res.json())
		.then(function (data) {
			if(data.status === 201) {
				// console.log(data);
				setFormSubmit(!FormSubmit);
				setIncTranslations(incTranslations => [...incTranslations, data.incident_translation]);
			}
			return alert(data.message);
		})
		.catch(err => console.log(err))
	};

	const handleFormToInciTrans = (formState) => {
		setFormSubmit(!formState)
	}

	let content = (
		<div className='incident-container'>
			<p> Loading ... </p>
		</div>)

	if(isLoaded)
	{
		const incTranslationDivs = incTranslations.map( (incTrans) =>

			<div key={incTrans.ID} className='incident-top'>

				{
					tokenIsStillValid() &&
					<div>
						{incTrans.language !== "en" && (
							<button type="button" onClick={() => handleButtonToDeleteIncidTransl(incTrans.ID)}>
								delete this translation
							</button>
						)}
					</div>
				}

				<p> <b>Language:</b> {langs.filter(lang => lang.code === incTrans.language)[0].name} </p>
				<p> <b>Narrative of Incident:</b></p> <p className="white-space-pre-line"> {incTrans.narrative_of_incident} </p>
				{/*<p> Current Status Summary: {incTrans.current_status_summary}</p>*/}
			</div>
		)

		const addIncidentTransl = () => {
			return(
			<div className="submit page">
				<div className="wrapper">
					<h2 className="title-edit">Submit a translation to Incident</h2>	
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
							{errors.language &&	<p className="error">Language is required</p>}
						</div>

						<div className='row'>
							<label htmlFor='incident_narrative'> Incident Narrative*</label>
							<textarea
								id={"incident_narrative"}
								name={"incident_narrative"}
								placeholder="Narrative of the incident."
								ref={register({ required: true })}/>
							{errors.incident_narrative &&	<p className="error">Narrative is required</p>}
						</div>

							<div className="row">
								<button type="button" className="btn" onClick={handleSubmit(handleFormSubmit)}>Submit</button>
							</div>
						</section>
					</form>
				</div>
			</div>
			)
		}

		content =  (
		<div>
			<div>
			{tokenIsStillValid() &&
				<div>
					{FormSubmit?
						<button type="button" onClick={() => handleFormToInciTrans(FormSubmit)}>
							close form to add translation
						</button>:
						<button type="button" onClick={() => handleFormToInciTrans(FormSubmit)}>
							Add a translation
						</button>
					}
				</div>
			}
			{FormSubmit && addIncidentTransl()}
				<p> <b className="incident-id-title">Incident ID #{props.data.ID}</b> </p>
				<p> <b>Date of Incident:</b> {convertMonthtoStringFormat(props.data.date_of_incident)}</p>
				<p> <b>Location:</b> {props.data.location} </p>
				{/*	<p> Disappearance: {props.data.is_disappearance}</p>
						<p> Direct Testimony: </p>
						<p> Discovery: </p> */
				}
			</div>

			{incTranslationDivs}
			<VictimMedia data={medias}/>
			<hr/>
		</div>
		)
	}
	return content
}

export default IncidentItem
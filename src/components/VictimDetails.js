import React from 'react';
import './ViewComponent.scss';
import { langs } from '../data/languages.js';

const VictimDetails = (props) => {

	if(!props.data)
		return (
		<div className='details-container'>
			<p> Loading ... </p>
		</div>
		)
	//console.log(props)
	//alert(props.data[0].languages_spoken);
	let language = langs.filter(lang => lang.code === props.data.language);
	//alert(language[0].code);
	return (
		<div className='details-container'>
			       {/* <p> Nationality </p>*/}
			<p> <b>Health Status:</b> {props?.data?.health_status} </p>
			<p> <b>Health Issues:</b> </p> <p className="white-space-pre-line"> {props?.data?.health_issues}  </p>
			<p> <b>Languages Spoken:</b> {props?.data?.languagues_spoken}	</p>			
			<p> <b>Profession:</b> {props?.data?.profession}</p>
			<p> <b>About the Victim:</b> </p> <p className="white-space-pre-line"> {props?.data?.about_the_victim} </p>
			<p> <b>Additional Information:</b> </p> <p className="white-space-pre-line"> {props?.data?.additional_information} </p>
		</div>
	)
}

export default VictimDetails

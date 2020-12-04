import React from 'react';
import { convertMonthtoStringFormat } from '../utils/utils';

import './ViewSidebar.scss';

const ViewSidebar = (props) => {
	console.log(props.data)
	const profile_image_url = props.data.profile_image_url;
	let top = (
		<React.Fragment>
			<div className='sidebar-header-1'>
				<p> {props.data.current_status} </p>
			</div>
			<div className='sidebar-body'>
				<div className='sidebar-pic'>
					   {profile_image_url ? <img className="photo"
	                    src={profile_image_url}
	                    alt="victim"
	                  /> : "No photo available"}
				</div>
				<div className='sidebar-header-2'>
					<p> {props.data.name} </p>
					<p> Victim ID: {props.data.ID} </p>
				</div>
				<div className='sidebar-content'>
					<b> Place of Birth </b>
					<p>  {props.data.place_of_birth} </p>
					<b> Date of Birth </b>
					<p> {convertMonthtoStringFormat(props.data.date_of_birth)} </p>
					<b> Legal Name </b>
					<p> {props.data.legal_name} </p>
					<b> Aliases </b>
					<p> {props.data.aliases} </p>
					<b> Country </b>
					<p> {props.data.country} </p>
					<b> Gender </b>
					<p> {props.data.gender} </p>
					<b> Last Seen Date </b>
					<p> {convertMonthtoStringFormat(props.data.last_seen_date)} </p>
					<b> Last Seen Place </b>
					<p> {props.data.last_seen_place} </p>
				</div>
			</div>
		</React.Fragment>
	)


	let bot = (
		<div className='sidebar-content'>
			<b> Entry Created </b>
			<p>	{convertMonthtoStringFormat(props.data.CreatedAt)} </p>
			<b> Last Updated </b>
			<p> {convertMonthtoStringFormat(props.data.UpdatedAt)} </p>
		</div>
	)

	return (
		<div className='sidebar-container'>
			<div className='sidebar-top'>
				{top}
			</div>
			<div className='sidebar-bot'>
				{bot}
			</div>
		</div>
	)
}

export default ViewSidebar

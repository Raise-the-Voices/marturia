import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { authContentTypeHeaders } from '../actions/headers';
import '../pages/User.scss'
import './OptionsMenu.scss'

const OptionMenu = (props) => {
  const { register, handleSubmit, errors } = useForm()
  const [ options, setOptions ] = useState(null);
	const uniqueOptionsGroup = ['current_status', 'health_status', 'incident_types'];

	const getAllOptions  = () => {
		fetch(process.env.REACT_APP_API_BASE + 'options', {
			method: "GET",
		})
		.then(res => res.json())
		.then(data => {
			console.log(data['options-list']);
			setOptions(data['options-list']);
		});  
	};

	useEffect(() => {
    getAllOptions();
	}, []);

  const handleFormSubmit = (data) => {

		// convert every string title to lowercase.
		data.title = data.title.toLowerCase();

		// validate if the title is unique in that group
		const uniqueOption = options.filter((item) => item.group === data.group && item.title === data.title);
		if (Object.entries(uniqueOption).length > 0) {
			return alert("this option already exist in that group!");
		}

		fetch(process.env.REACT_APP_API_BASE + 'options', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			if(data.status === 400) {
				//invalid request
				alert(data.message)
			} else if(data.status === 201) {
				//option created
				alert(data.message)
				Array.from(document.querySelectorAll("input")).forEach(input => (input.value = ""));
				getAllOptions();
			}  else if(data.status === 403) {
				//access forbidden
				alert('access forbidden');
			} else {
				//something went wrong
				alert('something went wrong')
			}
		})
		.catch(err => console.log(err))
	}
	
	function handleRemove(optionID) {
		console.log(optionID);
		// remove an option
		
		fetch(process.env.REACT_APP_API_BASE + 'options/'+ optionID, {
			method: 'DELETE',
			headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)
			if(data.status === 400) {
				//invalid request
				alert(data.message)
			} else if(data.status === 200) {
				//option created
				alert(data.message)
				getAllOptions();
			} else if (data.status === 404) {
				// option not found
				alert(data.message)
			}  else if(data.status === 403) {
				//access forbidden
				alert('access forbidden');
			} else {
				//something went wrong
				alert('something went wrong')
			}
		})
		.catch(err => console.log(err))
  }

  return (
		<div className='register'>
			<div className='option-container'>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					
					{/* OPTION INPUT */}
					<label htmlFor='title'>Option</label>
					<input type='text'name='title' placeholder="option"	ref={(input) => {	register(input, { required: true });}}/>
					{errors.title && <p className="form-error">Option is required</p>}

					{/* GROUP INPUT */}
					<label htmlFor='group'> Group </label>
					<select	id='group' name='group'	ref={(input) => {	register(input, { required: true });}}>
					<option	key={''} value=''>	Select a group </option>
					{uniqueOptionsGroup?.map(group => (	<option	key={group} value={group}>{group}</option>	))}
					</select>
					{errors.group && <p className="form-error">Group is required</p>}

					{/* BTN INPUT */}
					<button> Add a new Option </button>
				</form>
			</div>
			<div className="container">
				<div>
					<span className="row-title"> Name </span>
					<ul>
						{options?.map((item) => (
							<li className="list">
								<span> {item.title} </span>
							</li>
						))}
					</ul>
				</div>

				<div>
				<span className="row-title"> Group </span>
				<ul>
					{options?.map((item) => (
						<li className="list">
							<span> {item.group} </span>
						</li>
					))}
				</ul>
				</div>

				<div>
				<span className="row-title"> Remove </span>
								<ul>
									{options?.map((item) => (
										<li className="list">
											<button className="btn-option" type="button"  onClick={() => handleRemove(item.ID)}>
												Remove
											</button>
										</li>
									))}
								</ul>
				</div>

			</div>
		</div>
 	)
}

export default OptionMenu;
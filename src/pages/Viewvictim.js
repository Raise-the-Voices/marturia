import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import MainLayout from '../components/MainLayout';
import ViewSidebar from '../components/ViewSidebar';
import ViewVictimItem from '../components/ViewVictimItem';
import VictimMedia from '../components/VictimMedia';
import Incident from '../components/Incident';
import VictimDetails from '../components/VictimDetails';
import {authContentTypeHeaders} from '../actions/headers';
import { tokenIsStillValid } from '../utils/utils';
import './View.scss';

const ViewVictim = (props) => {
	let btnContainer = React.useRef()
	const [vicData, setVicData] = useState(null);
	const [incidents, setIncidents] = useState(null);
	const [translations, setTranslations] = useState(null);
	const [medias, setMedias] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [victimDNE, setVictimDNE] = useState(false);
	const [btnState, setbtnState] = useState(false);
	const [victimAvailableLang, setvictimAvailableLang] = useState(["English", "Spanish", "Chinese"])
	const [shown, setShown] = useState({
		"Victim Details": true,
		"Victim Media": true,
		"Incident List": true,
	});

	useEffect(() => {
		document.addEventListener("mousedown", (e) => handleClickOutside(e));
		document.removeEventListener("mousedown", (e) =>  handleClickOutside(e));
		fetch(process.env.REACT_APP_API_BASE + 'victims?idvictim=' + String(props.match.params.id), {
		  headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 200) {
				setVicData(data.victim);
				setIsLoaded(true);
			} else if(data.status === 404) {
				setVictimDNE(true);
			} else {
				//something went wrong
				setVictimDNE(true);
			}
		})
		.catch(err => console.log(err))

		fetch(process.env.REACT_APP_API_BASE + 'incidents?idvictim=' + String(props.match.params.id), {
		  headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 200) {
				//console.log(data)
				setIncidents(data.incidents)
			} else if(data.status === 400) {
				//params error
			} else {
				//something went wrong
			}
		})
		.catch(err => console.log(err))
		
		fetch(process.env.REACT_APP_API_BASE + 'victim-translations?idvictim=' + String(props.match.params.id), {
		  headers: authContentTypeHeaders()
		})
		.then(res => res.json())
		.then(data => {
			if(data.status === 200) {
				//console.log(data)
				setTranslations(data.translations)
			} else if(data.status === 400) {
				//params error
			} else {
				//something went wrong
			}
		})
		.catch(err => console.log(err))
		
		fetch(process.env.REACT_APP_API_BASE + 'victimmedias?idvictim=' + String(props.match.params.id), {
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
	}, []);

	const handleButtonClick = (state) => {
		setbtnState(!state);
	};

	const handleClickOutside = event => {
		if (btnContainer.current && !btnContainer.current.contains(event.target)) {
			setbtnState(false);
		}
	};
	

	let content;
	if(victimDNE) {
		content = (
			<div>
				<p> Victim with this ID does not exist </p>
			</div>
		)
	} else if(isLoaded) {
		 content = (
			<MainLayout>
				<div className='view-container'>
					<div className="victim-item-container">
						<div className="btn-container" ref={btnContainer}>
							<button type="button" className="translates-button" onClick={() => handleButtonClick(btnState)}>
								{/* ☰ */}
								<h6 className="drop-btn-title">Available Languages </h6>
							</button>
							{btnState && (<div className="dropdown">
								<ul className="dropdown-ul">
								{victimAvailableLang?.map((item) => (
									<li className="dropdown-li">
										<span> {item} </span>
									</li>
								))}
								</ul>
							</div>
							)}

						</div>
						{tokenIsStillValid() && <div >
							<ul className="ul-options">
								<li>
									<button type="button">
										{/* Add new route to the form for add a new translation */}
										<Link to="/" target="_blank">Add a new translation</Link>
									</button>
								</li>
								<li>
									<button type="button">
										{/* Add new route with translation ID to the form for edit it */}
										<Link to="/" target="_blank">Edit this translation</Link>
									</button>
								</li>
								<li>
									<button type="button">
										{/* Add new route or change it for a alert to confirm if want delete this translation
										 if choose yes, should show a loading meanwhile the deletes is deleted*/}
										<Link to="/" target="_blank">Delete this translation</Link>
									</button>
								</li>
							</ul>
						</div>
	}
						<ViewVictimItem
							category={"Victim Details"}
							shown={shown}
							setShown={setShown}
							info={<VictimDetails data={translations}/>}/>
							
						<ViewVictimItem
						 	category={"Victim Media"}
							shown={shown}
							setShown={setShown}
							info={<VictimMedia data={medias}/>}/>
						 
						<ViewVictimItem
						 	category={"Incident List"}
							shown={shown}
							setShown={setShown}
							info={<Incident victimId={props.match.params.id} data={incidents} />}/>
					</div>
					<ViewSidebar data={vicData}/>
				</div>
			</MainLayout>
		)
	} else {
		content = (
			<div>
				<p> loading... </p>
			</div>
		)
	}

	return content
}

export default ViewVictim

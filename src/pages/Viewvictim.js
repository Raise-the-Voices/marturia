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
import { langs } from '../data/languages.js';
import './View.scss';

const ViewVictim = (props) => {
	let btnContainer = React.useRef();
	const [vicData, setVicData] = useState(null);
	const [incidents, setIncidents] = useState(null);
	const [translations, setTranslations] = useState([]);
	const [translate, setTranslate] = useState({language:"en", code:"en"});
	const [medias, setMedias] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [victimDNE, setVictimDNE] = useState(false);
	const [btnState, setbtnState] = useState(false);
	const [victimAvailableLang, setvictimAvailableLang] = useState(null);
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

				let tempLangArry = [];
				data.translations.forEach(trans => {
					tempLangArry.push(langs.filter(lang => {
						return lang.code === trans.language
					}));
				});

				setvictimAvailableLang(tempLangArry);
				// console.log(tempLangArry);
				setTranslations(data.translations);
				setTranslate(data.translations[0]);
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

	const handleChangeTrans = selecLangua => {
		let consoletr = translations.filter(trans => trans.language === selecLangua);
		setTranslate(consoletr[0]);
	};

	const handleDeleteTranslate = (victranslateID) => {
		// console.log(victranslateID);

			fetch(process.env.REACT_APP_API_BASE + 'victim-translations/' + victranslateID, {
					method: "DELETE",
					headers: authContentTypeHeaders()
			})
			.then(res => res.json())
			.then(function (data) {	
				if(data.status === 200) {

				fetch(process.env.REACT_APP_API_BASE + 'victim-translations?idvictim=' + String(props.match.params.id), {
					headers: authContentTypeHeaders()
				})
				.then(res => res.json())
				.then(function (transList) {	
					if(transList.status === 200) {
						let tempLangArry = [];
						transList.translations.forEach(trans => {
							tempLangArry.push(langs.filter(lang => {
								return lang.code === trans.language
							}));
						});

						setvictimAvailableLang(tempLangArry);
						// console.log(tempLangArry);
						setTranslations(transList.translations);
						setTranslate(transList.translations[0]);
					} else if(transList.status === 400) {
						//params error
					} else {
						//something went wrong
					}
				});
			}
		})
		.catch(err => console.log(err))
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
									<li className="dropdown-li" key={item[0].name} onClick={() => handleChangeTrans(item[0].code)}>  
										<span> {item[0].name} </span>
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
										<Link to={`/submit-vict-trans/${props.match.params.id}`} target="_blank">Add a new translation</Link>
									</button>
								</li>
								<li>
									<button type="button">
										{/* Add new route with translation ID to the form for edit it */}
										<Link to={`/edit-vict-trans/${translate.ID}`} target="_blank">Edit this translation</Link>
									</button>
								</li>

								{translate?.language !== "en" && (<li>
									<button type="button" onClick={() => handleDeleteTranslate(translate.ID)}>
										<span>Delete this translation</span>
									</button>
								</li>)}
							</ul>
						</div>
						}
						<ViewVictimItem
							category={"Victim Details"}
							shown={shown}
							setShown={setShown}
							info={<VictimDetails data={translate}/>}/>
							
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

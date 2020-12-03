export function getISOfromDatepicker(date) {
	if(!date)
		return null
	let iso = "T00:00:00+00:00"
	return date + iso
}

//date is of type iso string
export function getMMDDYYYYfromISO(date) {
	if (date === null) {
		return "Unknown";
	} else {
		return date.slice(0, 10);
	}
}

//date is of type iso string
export function getAge(date) {
	let parsed = Date.parse(date)
	let diff = Date.now() - parsed
	let ageDate = new Date(diff)
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

//checking to see if the token is expired
export function tokenIsStillValid() {
	let expirationToken = localStorage.getItem('expiration')
	if(!expirationToken || expirationToken ==="undefined")
		return false
	let exp = Date.parse(expirationToken)
	let now = Date.now()
	if(now > exp) {
		return false
	}
	return localStorage.getItem('token') !== null
}

// function to check if a link is of valid format to be used to open an external link
export function isValidURL(urlString) {
	const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_=,]*)?$', 'i'); // fragment locator
	return pattern.test(urlString);
}


export const doesLinkExistInMediaList = (mediaList,link) => {
	const numberOfMedia = mediaList.length;
	for(let i=0;i<numberOfMedia;i+=1)
		if(mediaList[i].mediaurl===link) return true;
	return false;
}
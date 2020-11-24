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

//date is of iso type string
export function convertMonthtoStringFormat(date) {
	const MONTH_NUM_TO_STR = {
    "01": "January", "02":"February", "03":"March","04":"April","05":"May",
    "06":"June","07":"July","08":"August","09":"September","10":"October",
		"11":"November","12":"December"};

		let date_need = getMMDDYYYYfromISO(date);
		if (date_need !== "Unknown") {
			let date_list = date_need.split("-")
			let month = date_list[1];
			date_list[1] = MONTH_NUM_TO_STR[month];
			return date_list.join(" ");
		}
		return date_need;
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

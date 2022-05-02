function searchCustomer(){
	var search_input = document.getElementById('search_input').value
	window.location = '/customers/search/' + encodeURI(search_input)
}

function searchCustomerByLastName(){
	var search_last = document.getElementById('search_last').value
	window.location = '/customers/searchLast/' + encodeURI(search_last)
}

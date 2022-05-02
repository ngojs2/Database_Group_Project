function filterLocationByID() {
    
    var location_id = document.getElementById('location_filter').value
    
    window.location = '/locations/filter/' + location_id
    
}
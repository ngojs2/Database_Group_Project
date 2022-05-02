function filterProductsByStore() {
    
    var store_id = document.getElementById('store_filter').value
    
    window.location = '/products/filter/' + store_id
}
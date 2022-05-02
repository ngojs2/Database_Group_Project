function filterOrdersByCustomerID() {
    
    var customer_id = document.getElementById('customerID_filter').value

    window.location = '/orders/filter/' + parseInt(customer_id)
}

function filterOrdersByStoreID() {
    var store_id = document.getElementById('storeID_filter').value

    window.location = '/orders/filterstore/' + parseInt(store_id)

}

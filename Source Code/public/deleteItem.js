function deleteItem(id){
    $.ajax({
        url: '/addDetails/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

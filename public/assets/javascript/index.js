$(document).ready( ()=> {
    $('.save').on('click', function(e) {
        e.preventDefault();
            const id = $(this).data('id');
            $.ajax({
                url: `/save/${id}`,
                method: 'PUT'
            })
            window.location.href = '/'
        })
})
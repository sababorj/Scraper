$(document).ready( ()=> {
    $('.save').on('click', function(e) {
        e.preventDefault();
            const id = $(this).data('id');
            $.ajax({
                url: `/save/${id}`,
                method: 'PUT'
            })
            window.location.reload(); 
        });

        $('.clear').on('click', function(e) {
            e.preventDefault();
            $.ajax({
                url: '/delete',
                method: 'GET'
            })
                window.location.reload();
        })

        $('.scrape-new').on('click', function(e) {
            e.preventDefault();
            $.ajax({
                url:'/scrape',
                method: 'GET'
            })
            setTimeout(function(){
                window.location.reload()
            } , 500)
        })
})
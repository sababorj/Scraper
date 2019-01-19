$(document).ready(() => {
    $('.save').on('click', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        $.ajax({
            url: `/save/${id}`,
            method: 'PUT'
        })
        window.location.reload();
    });

    $('.clear').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/clear',
            method: 'GET'
        })
        window.location.reload();
    })

    $('.scrape-new').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/scrape',
            method: 'GET'
        })
        setTimeout(function () {
            window.location.reload()
        }, 500)
    })

    $('.delete').on('click', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        $.ajax({
            url: `/delete/${id}`,
            method: 'GET'
        })
        window.location.reload();
    })

    $('.saveNote').on('click', function (e) {
        id = $(this).data('id');
        e.preventDefault();
        $.ajax({
            url: '/note',
            method: 'POST',
            data: {
               msg: $('textarea').val(),
               id: $(this).data('id')
            }
        }).then(() => {
            $('textarea').empty()
        })
        setTimeout(function () {
            window.location.href = `/note/${id}` ;
        }, 500)
        
    })

    $('.note-delete').on('click', function (e) {
        id = $(this).data('id');
        e.preventDefault();
        $.ajax({
            url: '/note',
            method: 'DELETE',
            data: {
                id: $(this).data('id')
             }
        })
        setTimeout(function () {
            window.location.reload()
        }, 100)
    })

})
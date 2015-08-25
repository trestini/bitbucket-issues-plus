var session = {};

$(document).ready(function(){/* off-canvas sidebar toggle */

    $('[data-toggle=offcanvas]').click(function() {
        $(this).toggleClass('visible-xs text-center');
        $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
        $('.row-offcanvas').toggleClass('active');
        $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
        $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
        $('#btnShow').toggle();
    });

    $('#go-auth').click(function (e) {
        e.preventDefault();
        var hash = btoa($('#username').val() + ':' + $('#password').val());
        $.ajax({
            url : 'https://api.bitbucket.org/1.0/user',
            headers : {
                'Authorization' : 'Basic ' + hash
            },
            success : function (data, status, xhr) {
                console.log(data);
                session.basicAuth = { 'Authorization' : 'Basic ' + hash }
                session.user = data.user;
                $('#user-icon').html('<img src="' + session.user.avatar + '" width="100%"/>');
            },
            error : function (err) {
                console.error(err);
            }
        });
    });


    //$.ajax({
    //    success : function (data, status, xhr) {
    //        var table = "";
    //        for( var i in data.issues ){
    //            var issue = data.issues[i];
    //            table +=
    //                '<tr>' +
    //                    '<td>' + issue.priority + '</td>' +
    //                    '<td>' + issue.title + '</td>' +
    //                    '<td>' + issue.metadata.kind + '</td>' +
    //                    '<td>' + issue.status + '</td>' +
    //                    '<td>' + issue.metadata.milestone + '</td>' +
    //                '</tr>\n';
    //        }
    //
    //        $('#issues-table tbody').html(table);
    //    }
    //});

});

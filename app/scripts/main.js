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

    $('#logout').click(function () {
        sessionStorage['bitbucket-issues-plus_session'] = undefined;
        location.reload();
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
                session.basicAuth = { 'Authorization' : 'Basic ' + hash }
                session.user = data.user;
                session.repositories = data.repositories;

                sessionStorage['bitbucket-issues-plus_session'] = JSON.stringify(session);

                $('#display_name').html(session.user.display_name);
                $('#issue_count').html(data.length);
                $('#avatar').attr('src', session.user.avatar);

                var repos = "";
                for( var i in session.repositories ){
                    var repo = session.repositories[i];
                    repos += '<li><a href="javascript:selectRepo(\'' + repo.slug + '\')">' + repo.name + '</a></li>'
                }

                $('#repos').html(repos);

                $('#form').hide();
                $('#mainnav').show();

                //refreshTable();
            },
            error : function (err) {
                console.error(err);
            }
        });
    });

    if( sessionStorage['bitbucket-issues-plus_session'] !== "undefined" ){
        session = JSON.parse(sessionStorage['bitbucket-issues-plus_session']);
        $('#display_name').html(session.user.display_name);

        var repos = "";
        for( var i in session.repositories ){
            var repo = session.repositories[i];
            repos += '<li><a href="javascript:selectRepo(\'' + repo.slug + '\')">' + repo.name + '</a></li>'
        }

        $('#repos').html(repos);

        $('#form').hide();
        $('#mainnav').show();

        if( session.selectedRepo !== undefined ){
            refreshTable();
        }

    }

    $('#edit').click(function () {
        $('#editModal').modal();
    });

});

function selectRepo(repo){
    session.selectedRepo = repo;
    refreshTable();
}

function refreshTable(){
    $.ajax({
        url: 'https://api.bitbucket.org/1.0/repositories/' + session.user.username + '/' + session.selectedRepo + '/issues',
        method : 'GET',
        headers: session.basicAuth,
        success : function (data, status, xhr) {
            var table = "";
            for( var i in data.issues ){
                var issue = data.issues[i];

                var priorityIcon = "glyphicon ";

                switch (issue.priority){
                    case "trivial":
                        priorityIcon += "glyphicon-thumbs-up text-color-black";
                        break;
                    case "minor":
                        priorityIcon += "glyphicon-arrow-down text-color-black";
                        break;
                    case "major":
                        priorityIcon += "glyphicon-arrow-up text-color-black";
                        break;
                    case "critical":
                        priorityIcon += "glyphicon-warning-sign text-color-yellow";
                        break;
                    case "blocker":
                        priorityIcon += "glyphicon-ban-circle text-color-red";
                        break;
                }

                table +=
                    '<tr data-id="' + issue.local_id + '" class="clickable">' +
                    '<td><i class="' + priorityIcon + '" style="font-size:0.8em"></i></td>' +
                    '<td>' + issue.title + '</td>' +
                    '<td>' + issue.metadata.kind + '</td>' +
                    '<td>' + issue.status + '</td>' +
                    '<td>' + issue.metadata.milestone + '</td>' +
                    '</tr>\n';
            }

            $('#issues-table tbody').html(table);

            $('tr.clickable').click(function () {
                var tr = $(this);
                var isSelected = tr.attr('selected');
                tr.css('background-color', (isSelected ? '' : '#d1fbff') );
                tr.attr('selected', !isSelected);

            });

        },
        error : function (xhr, status, error) {
            var errMsg = JSON.parse(xhr.responseText);

            var alert = '<div class="alert alert-danger">' +
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
            '<span>' + errMsg.error.message + '</span></div>';

            $('#message')
                .html(alert);
        }
    });

}

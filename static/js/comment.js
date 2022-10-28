$(document).ready(function () {
    get_comment()
    close_comment()
    get_team_lists()
});

function close_comment() {
    $('#open-cmd').show()
    $('#comment-box-id').hide()
}

function open_comment() {
    $('#comment-box-id').show()
    $('#open-cmd').hide()
}

// team-lists
function get_team_lists() {
    $.ajax({
        type: "GET",
        url: "/teams",
        data: {},
        success: function (response) {
            let rows = response['team']

            for (let i = 0; i < rows.length; i += 1) {
                let team_name = rows[i]['teamName']
                let temp_html = `<option value="${team_name}">${team_name}</option>`

                $('#choice-team').append(temp_html)
                $('#my-team').append(temp_html)
            }
        }
    })
}

function get_comment() {
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response['all_users']

            for (let i = 0; i < rows.length; i += 1) {
                let comment = rows[i]['comment']
                let nickname = rows[i]['nickname']
                let team = rows[i]['team']

                let temp_html = `<div class="card">
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                            <p>${comment}</p>
                                            <footer class="blockquote-footer">
                                                <span style="color: blue">${nickname}</span>님이 <span style="color: red">${team}</span>를 응원합니다.
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>`
                $('#comment-list').append(temp_html)
            }
        }
    })
}

function get_myTeam_comment() {
    let myTeam = $('#my-team').val()

    $.ajax({
        type: "GET",
        url: `/read/team?my_team_give=${myTeam}`,
        data: {team: myTeam},
        success: function (response) {
            let rows = response['select_users']

            if (response['msg'] === '전체보기') {
                // todo: 댓글 목록을 바꿔줘라
                $('#comment-list').empty() // 비우고
                for (let i = 0; i < rows.length; i += 1) {
                    let comment = rows[i]['comment']
                    let nickname = rows[i]['nickname']
                    let team = rows[i]['team']
                    console.log(comment, nickname, team)

                    let temp_html = `<div class="card">
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                            <p>${comment}</p>
                                            <footer class="blockquote-footer">
                                                <span style="color: blue">${nickname}</span>님이 <span style="color: red">${team}</span>를 응원합니다.
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>`
                    $('#comment-list').append(temp_html) // 채우고
                }
            } else {
                // todo: 댓글 목록을 바꿔줘라
                $('#comment-list').empty() // 비우고
                for (let i = 0; i < rows.length; i += 1) {
                    let comment = rows[i]['comment']
                    let nickname = rows[i]['nickname']
                    let team = rows[i]['team']
                    console.log(comment, nickname, team)

                    let temp_html = `<div class="card">
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                            <p>${comment}</p>
                                            <footer class="blockquote-footer">
                                                <span style="color: blue">${nickname}</span>님이 <span style="color: red">${team}</span>를 응원합니다.
                                            </footer>
                                        </blockquote>
                                    </div>
                                </div>`
                    $('#comment-list').append(temp_html) // 채우고
                }
            }
        }
    })
}

function save_comment() {
    let team = $('#choice-team').val()
    let nickname = $('#nickname').val()
    let comment = $('#comment').val()

    $.ajax({
        type: "POST",
        url: "/comment",
        data: {
            team_give: team,
            nickname_give: nickname,
            comment_give: comment
        },
        success: function (response) {
            if (response['team'] === '응원할 팀을 선택하세요') {
                alert('응원할 팀을 선택하세요')
            } else {
                alert(response['msg'])
                window.location.reload()
            }
        }
    })
}
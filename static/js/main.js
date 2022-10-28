$(document).ready(function () {
    today_game_list()

    //달력
    function c() {
        p();
        var e = h();
        var r = 0;
        var u = false;
        l.empty();
        while (!u) {
            if (s[r] == e[0].weekday) {
                u = true
            } else {
                l.append('<div class="blank"></div>');
                r++
            }
        }
        for (var c = 0; c < 42 - r; c++) {
            if (c >= e.length) {
                l.append('<div class="blank"></div>')
            } else {
                var v = e[c].day;
                var m = g(new Date(t, n - 1, v)) ? '<div class="today">' : "<div>";
                l.append(m + "" + v + "</div>")
            }
        }
        var y = o[n - 1];
        a.css("background-color", y).find("h1").text(i[n - 1] + " " + t);
        f.find("div").css("color", y);
        l.find(".today").css("background-color", y);
        d()
    }

    function h() {
        var e = [];
        for (var r = 1; r < v(t, n) + 1; r++) {
            e.push({day: r, weekday: s[m(t, n, r)]})
        }
        return e
    }

    function p() {
        f.empty();
        for (var e = 0; e < 7; e++) {
            f.append("<div>" + s[e].substring(0, 3) + "</div>")
        }
    }

    function d() {
        var t;
        var n = $("#calendar").css("width", e + "px");
        n.find(t = "#calendar_weekdays, #calendar_content").css("width", e + "px").find("div").css({
            width: e / 7 + "px",
            height: e / 7 + "px",
            "line-height": e / 7 + "px"
        });
        n.find("#calendar_header").css({height: e * (1 / 7) + "px"}).find('i[class^="fa-solid"]').css("line-height", e * (1 / 7) + "px")
    }

    function v(e, t) {
        return (new Date(e, t, 0)).getDate()
    }

    function m(e, t, n) {
        return (new Date(e, t - 1, n)).getDay()
    }

    function g(e) {
        return y(new Date) == y(e)
    }

    function y(e) {
        return e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate()
    }

    function b() {
        var e = new Date;
        t = e.getFullYear();
        n = e.getMonth() + 1
    }

    var e = 480;
    var t = 2013;
    var n = 9;
    var r = [];
    var i = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    var s = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var o = ["#16a085", "#1abc9c", "#c0392b", "#27ae60", "#FF6860", "#f39c12", "#f1c40f", "#e67e22", "#2ecc71", "#e74c3c", "#d35400", "#2c3e50"];
    var u = $("#calendar");
    var a = u.find("#calendar_header");
    var f = u.find("#calendar_weekdays");
    var l = u.find("#calendar_content");
    b();
    c();
    a.find('i[class^="fa-solid"]').on("click", function () {
        var e = $(this);
        var r = function (e) {
            n = e == "next" ? n + 1 : n - 1;
            if (n < 1) {
                n = 12;
                t--
            } else if (n > 12) {
                n = 1;
                t++
            }
            c()
        };
        if (e.attr("class").indexOf("left") != -1) {
            r("previous")
        } else {
            r("next")
        }
    })

    // 날짜 클릭
    l.on("click", "div", function () {
        let click_year = t.toString()
        let click_month = i[n - 1]

        if (click_month == 'JANUARY') {
            click_month = 1;
        } else if (click_month == 'FEBRUARY') {
            click_month = 2;
        } else if (click_month == 'MARCH') {
            click_month = 3;
        } else if (click_month == 'APRIL') {
            click_month = 4;
        } else if (click_month == 'MAY') {
            click_month = 5;
        } else if (click_month == 'JUNE') {
            click_month = 6;
        } else if (click_month == 'JULY') {
            click_month = 7;
        } else if (click_month == 'AUGUST') {
            click_month = 8;
        } else if (click_month == 'SEPTEMBER') {
            click_month = 9;
        } else if (click_month == 'OCTOBER') {
            click_month = 10;
        } else if (click_month == 'NOVEMBER') {
            click_month = 11;
        } else if (click_month == 'DECEMBER') {
            click_month = 12;
        }

        let click_day = $(this).text()

        // console.log(click_year, click_month, click_day)
        $('#selected_date').text(click_year + '. ' + click_month + '. ' + click_day + '.')
        get_game_list(click_year, click_month, click_day)

        // console.log("클릭")
        $('#change_game_table > tbody').empty()
        $(this).css({'background-color': 'rgb(231, 76, 60)', 'color': '#fff', 'opacity': 0.7})
        $(this).siblings().css({'background-color': '#fff', 'color': '#000', 'opacity': 1})
    })

});


function today_game_list() {
    //오늘의 경기 크롤링
    var currentDate = new Date();
    var today_date = document.getElementById('today_date')

    today_date.innerText = currentDate.toLocaleDateString().toString();

    $.ajax({
        type: "GET",
        url: "/todayGame",
        data: {},
        success: function (response) {
            $('#today_game_table > tbody').empty()
    
            let games = response['game']
            if (games.length == 0) {
                let temp_html = `<tr>
                                    <td><p></p></td>
                                    <td><p>경기가 없습니다.</p></td>
                                    <td><p></p></td>
                                </tr>`
                $('#change_game_table > tbody').append(temp_html)
            } else {
                for (let i = 0; i < games.length; i++) {
                    let left_team = games[i]['left_team']
                    let right_team = games[i]['right_team']
                    let game_time = games[i]['game_time']
                    let game_place = games[i]['game_place']
                    let game_score = games[i]['game_score']
            
                    if (game_score == 'VS') {
                        temp_html = `<tr>
                                        <td>${game_time}</td>
                                        <td>${left_team} : ${right_team}</td>
                                        <td>${game_place}</td>
                                    </tr>`
                    } else {
                        temp_html = `<tr>
                                        <td>${game_time}</td>
                                        <td>${left_team} <strong>${game_score}</strong> ${right_team}</td>
                                        <td>${game_place}</td>
                                    </tr>`
                    }
                    $('#today_game_table > tbody').append(temp_html)
                }
            }
        }
    })
}

// 날짜 클릭시 경기 변경
function get_game_list(a, b, c) {
    show_list()
    let year = a;
    let month = b;
    let day = c;

    // makeUrl(year, month, day)

    $.ajax({
        type: "POST",
        url: "/gamelist",
        data: {year_give: year, month_give: month, day_give: day},
        success: function (response) {
            // console.log("잘 옴")
            let games = response['games']
            if (games.length == 0) {
                let temp_html = `<tr>
                                    <td><p></p></td>
                                    <td><p>경기가 없습니다.</p></td>
                                    <td><p></p></td>
                                </tr>`
                $('#change_game_table > tbody').append(temp_html)
            } else {
                for (let i = 0; i < games.length; i++) {
                    let left_team = games[i]['left_team']
                    let right_team = games[i]['right_team']
                    let game_time = games[i]['game_time']
                    let game_place = games[i]['game_place']
                    let game_score = games[i]['game_score']
                    
                    if (game_score == 'VS') {
                        temp_html = `<tr>
                                        <td>${game_time}</td>
                                        <td>${left_team} : ${right_team}</td>
                                        <td>${game_place}</td>
                                    </tr>`
                    } else {
                        temp_html = `<tr>
                                        <td>${game_time}</td>
                                        <td>${left_team} <strong>${game_score}</strong> ${right_team}</td>
                                        <td>${game_place}</td>
                                    </tr>`
                    }
                    $('#change_game_table > tbody').append(temp_html)
                }
            }
        }
    })
}

function show_list() {
    $('#change_game_wrap').show()
}






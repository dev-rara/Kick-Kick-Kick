$(document).ready(function () {
    show_news()
});

function show_news() {
    $.ajax({
        type: "GET",
        url: "/newslist",
        data: {},
        success: function (response) {
            $('#news-box').empty()

            let rows = response['news']

            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let img = rows[i]['img']
                let desc = rows[i]['desc']
                let source = rows[i]['source']
                let byline = rows[i]['byline']
                let url = rows[i]['url']

                let temp_html = `<div onclick="window.open('${url}')" class="example-2 card">
                                            <div class="wrapper" style="background: url(${img}) center/cover no-repeat">
                                                <div class="date">
                                                    <span class="day">${source}</span>
                                                </div>
                                                <div class="data">
                                                    <div class="content">
                                                        <span class="author">${byline}</span>
                                                        <h1 class="title"><a href="#">${title}</a></h1>
                                                        <p class="text">${desc}</p>
                                                        <a href="#" class="button">기사로 이동하기</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                $('#news-box').append(temp_html)
            }
        }
    });
}

function show_video() {
    $.ajax({
        type: "GET",
        url: "/videolist",
        data: {},
        success: function (response) {
            $('#news-box').empty()

            let rows = response['video']

            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let img = rows[i]['img']
                let play = rows[i]['play']
                let url = rows[i]['url']

                let temp_html = `<div class="cell-content" onclick="window.open('${url}')">
                                    <div class="item item-thumbnail" style="background-image: url(${img})">
                                    </div>
                                    <div class="item item-label">
                                        <h3 class="headline">${title}</h3>
                                        <div class="spacer2"></div>
                                        <p class="item-context">재생수 : ${play}</p>
                                    </div>
                                </div>`
                $('#news-box').append(temp_html)
            }
        }
    });
}

function sort(num) {
    let temp = location.href.split("?")[1]

}
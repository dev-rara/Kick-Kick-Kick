from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test_user:sparta@cluster0.u1zjohc.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbsparta

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# 오늘의 경기 크롤링
@app.route('/todayGame', methods=["GET"])
def today_games():
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%ED%95%B4%EC%99%B8%EC%B6%95%EA%B5%AC+%EA%B2%BD%EA%B8%B0%EC%9D%BC%EC%A0%95&oquery=2022%EB%85%84+10%EC%9B%94+27%EC%9D%BC+%ED%95%B4%EC%99%B8%EC%B6%95%EA%B5%AC+%EA%B2%BD%EA%B8%B0%EC%9D%BC%EC%A0%95&tqi=h1gFssprvxssscncMlRssssstds-307347',headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    today_game_list = soup.select('#main_pack > section.sc_new.cs_sportsdb._cs_sports_schedule > div > div.api_cs_wrap > div.db_area._schedule_info > div.db_list > table > tbody > tr')
    today_game_list_all = []

    for game in today_game_list:
        left_team = game.select_one('td.l_team > span.txt_name > a')['title']
        right_team = game.select_one('td.r_team > span.txt_name > a')['title']
        game_time = game.select_one('td.time > div > span').text
        game_place = game.select_one('td.place > span').text
        game_score = game.select_one('td.score').text

        doc = {
            'left_team': left_team,
            'right_team': right_team,
            'game_time': game_time,
            'game_place': game_place,
            'game_score': game_score
        }
        today_game_list_all.append(doc)
    print(today_game_list_all)

    return jsonify({'game': today_game_list_all})

#날짜에 따라 url 생성
def makeUrl(year, month, day):
    url = "https://search.naver.com/search.naver?sm=tab_drt&where=nexearch&ie=utf8&query=" + \
          str(year) + "%EB%85%84%20" + str(month) + "%EC%9B%94%20" + str(day) + \
          "%EC%9D%BC%20%ED%95%B4%EC%99%B8%EC%B6%95%EA%B5%AC%20%EA%B2%BD%EA%B8%B0%EC%9D%BC%EC%A0%95"
    return url

#입력받은 날짜로 크롤링
@app.route("/gamelist", methods=["POST"])
def get_game_list():
    year = request.form['year_give']
    month = request.form['month_give']
    day = request.form['day_give']
    url = makeUrl(year, month, day)
    print(url)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)
    
    soup = BeautifulSoup(data.text, 'html.parser')
    
    game_list = soup.select(
        '#main_pack > section.sc_new.cs_sportsdb._cs_sports_schedule > div > div.api_cs_wrap > div.db_area._schedule_info > div.db_list > table > tbody > tr')
    game_list_all = []
    
    for game in game_list:
        left_team = game.select_one('td.l_team > span.txt_name > a')['title']
        right_team = game.select_one('td.r_team > span.txt_name > a')['title']
        game_time = game.select_one('td.time > div > span').text
        game_place = game.select_one('td.place > span').text
        game_score = game.select_one('td.score').text
        
        doc = {
            'left_team': left_team,
            'right_team': right_team,
            'game_time': game_time,
            'game_place': game_place,
            'game_score': game_score
        }
        game_list_all.append(doc)
    print(game_list_all)
    
    return jsonify({'games': game_list_all})


# 뉴스
@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/videolist', methods=["GET"])
def video_list():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://sports.news.naver.com/wfootball/news/index?isphoto=N', headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    list_video = soup.select('#news_vod > div.aside_vod_best2 > ul > li')
    hot_video = []

    for video in list_video:
        code = video.select_one('a')['href'].split('&id')

        url = 'https://sports.news.naver.com/wfootball/vod/index?id' + code[1] + '&' + code[0].split('?')[1]
        data = requests.get(url, headers=headers)

        soup = BeautifulSoup(data.text, 'html.parser')

        img = soup.select_one('meta[property="og:image"]')['content']
        title = soup.select_one('#video_summary > h3').text
        play = soup.select_one('#video_summary > div.info > span.play').text.split('재생수')[1]

        doc = {
            'title': title,
            'img': img,
            'play': play,
            'url': url
        }
        hot_video.append(doc)

    return jsonify({'video': hot_video})

@app.route('/newslist', methods=["GET"])
def news_list():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://sports.news.naver.com/wfootball/news/index?isphoto=N&type=popular', headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    list_news = soup.select('#_ranking_news_list_0 > li')

    hot_news = []

    for n in list_news:
        url = 'https://sports.news.naver.com' + n.find('a')['href']

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
        data = requests.get(url, headers=headers)

        soup = BeautifulSoup(data.text, 'html.parser')

        title = soup.select_one('meta[property="og:title"]')['content']
        img = soup.select_one('meta[property="og:image"]')['content']
        desc = soup.select_one('meta[property="og:description"]')['content'][0:99] + "……"
        article = soup.select('#newsEndContents > p')
        source = article[0].text.split(' ')[1]
        byline = article[1].text

        doc = {
            'title': title,
            'img': img,
            'desc': desc,
            'source': source,
            'byline': byline,
            'url': url
        }
        hot_news.append(doc)

    return jsonify({'news': hot_news})

# 해외축구팀 크롤링
@app.route("/teams", methods=["GET"])
def get_team_lists():
    db.sportsTeamLists.delete_many({}, {})

    headers_url = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
    headers = {'User-Agent': headers_url}

    url = 'https://ko.wikipedia.org/wiki/%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%EB%A6%AC%EA%B7%B8_%EA%B5%AC%EB%8B%A8_%EB%AA%A9%EB%A1%9D'
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    # mw-content-text > div.mw-parser-output > table > tbody > tr:nth-child(1) > td:nth-child(1) > b > a
    teams = soup.select('#mw-content-text > div.mw-parser-output > table > tbody > tr')

    for team in teams:
        a_tag = team.select_one('td:nth-child(1) > b > a')

        if a_tag is not None:
            doc = {
                'teamName': a_tag['title']
            }
            db.sportsTeamLists.insert_one(doc)

    all_teams = list(db.sportsTeamLists.find({}, {'_id': False}))

    return jsonify({
        'team': all_teams
    })

@app.route('/commentPage')
def comment():
    return render_template('comment.html')

@app.route("/comment", methods=["POST"])
def sports_post():
    team_receive = request.form['team_give']
    nickname_receive = request.form['nickname_give']
    comment_receive = request.form['comment_give']

    doc = {
        'team': team_receive,
        'nickname': nickname_receive,
        'comment': comment_receive
    }
    db.kick.insert_one(doc)

    return jsonify({
        'msg': '응원 완료!'
    })


@app.route("/comment", methods=["GET"])
def sports_get():
    all_users = list(db.kick.find({}, {'_id': False}))
    print(all_users)

    return jsonify({
        'all_users': all_users
    })


# 여기는 처음부터 키워드를 받아와서 GET 요청을 오지게 후린다
@app.route("/read/team", methods=["GET"])
def about_my_team():
    team_receive = request.args.get('my_team_give')
    if team_receive == '전체보기':
        select_users = list(db.kick.find({}, {'_id': False}))
    else:
        select_users = list(db.kick.find({'team': team_receive}, {'_id': False}))
        print('select_users: ', select_users)

    return jsonify({
        'select_users': select_users
    })


if __name__ == '__main__':
   app.run('0.0.0.0', port=5000)
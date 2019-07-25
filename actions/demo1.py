from . import action

import requests


@action('test_action')
def test_action(obj):
    obj.name = "完成了一项自动化后台任务"


@action('change_tags')
def changetags(obj):
    obj.tags = ['测试1']


@action('get_current_playing_music')
def get_current_playing_music(obj):
    r = requests.get('https://api.gine.me/currently_playing').json()
    name = r['music']['item']['name']
    obj.name = name

# do you task here
from types import SimpleNamespace
from configparser import ConfigParser

from flask import Flask, escape, request, Response
from flask_cors import CORS
from notion.client import NotionClient
from notion.collection import CollectionQuery
from notion.block import CodeBlock, EmbedOrUploadBlock
from notion.utils import remove_signed_prefix_as_needed

from actions import notion_plus


conf = ConfigParser()
conf.read('config.ini')
token = conf.get('notion', 'token')
timezone = conf.get('notion', 'timezone')
auth_token = conf.get('security', 'auth_token')
client = NotionClient(token_v2=token, timezone=timezone)

app = Flask(__name__)
CORS(app)


def get_notion_action_code(action_name, action_table_url):
    actions_cv = client.get_collection_view(action_table_url)

    action_block = None
    q = CollectionQuery(actions_cv.collection, actions_cv, action_name)
    for row in q.execute():
        print(row)
        action_block = row

    action_code = None
    for block in action_block.children:
        if isinstance(block, CodeBlock):
            action_code = block.title
    return action_code


@app.route('/', methods=['POST'])
def npp():
    auth = request.headers.get('authtoken')
    if auth == auth_token:
        act = SimpleNamespace(**request.json)
        action_name = None
        obj = client.get_block(act.blockID)

        if act.actionName.startswith('#'):
            action_name = act.actionName.split('#')[-1]
            action_code = get_notion_action_code(action_name, act.actionTableUrl)
            if action_code:
                exec(action_code)
            else:
                return 'Task Code Not Found'
        elif act.actionName.startswith('@'):
            action_name = act.actionName.split('@')[-1]
            func = notion_plus.action_func_map[action_name]
            func(obj)
        setattr(obj, action_name, False)
        return 'Ok'
    else:
        return 'Bad Token'

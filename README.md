# NotionPlus

## Features

https://www.youtube.com/watch?v=6Nn-NnXiQiU

## Getting Started ([中文文档](https://gine.me/posts/cc5deab1a79f443c919b41ec80a50b7d))

### Prerequisites

+ python3
+ pipenv


### Installing

1. install [chrome extension](https://chrome.google.com/webstore/detail/notionplus/mlmicgheiiebfodpmpgcekbhkeipeald)
2. get source code and install requirements
```
git clone https://github.com/mayneyao/NotionPlus.git
cd NotionPlus
pipenv install
```

## Deployment

### Config 

1. backend config 
```
cp config.sample.ini config.ini
```

+ token: get `token_v2` from  cookies 
+ timezone: 
+ auth_token: nobody knows but you

2. chrome extension config

+ serverHost: If you run the backend service locally, it should be http://127.0.0.1:5000
+ authToken: Same as `conf.ini > security > auth_token`  (nobody knows but you)
+ actionTableUrl: Where dynamic task code is (a notion table browser url)

### Run

```
./run.sh 
```

## Built With

* [notion-py](https://github.com/mayneyao/notion-py) - Notion.so API(forked from jamalex/notion-py)
* [create-react-browser-extension](https://github.com/gxvv/create-react-browser-extension) - Easy to make chrome extension


## Changelog

see the [tags on this repository](https://github.com/mayneyao/NotionPlus/tags). 

## Acknowledgments

* [@jamalex/notion-py](https://github.com/jamalex/notion-py)

## License
MIT

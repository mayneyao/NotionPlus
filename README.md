# NotionPlus

![demo](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0fe2c6e3-d91d-4d76-af29-9e2458d01b8a%2Fnotion_plus_demo.gif)

## Getting Started ([中文文档](https://www.notion.so/gine/a8acca1517e34bdaa60d3fc1d51de425))

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

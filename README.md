# Parser for the [Dns-markdown](https://github.com/ebulgakov/dns-markdown-next) 

## Parser preparation instructions.
* Task parser files from the Gist and place them in the parser directory.
* Create a `request.sh` file with a curl request to the last page in the root directory.

## .env

Rename the `.env.example` file to `.env` and fill in the required variables.

## Create new docker image

```sh
docker build -t dns-markdown-parser .
```

### Run parser

```sh
docker run -p 3100:3100 -d --env-file .env dns-markdown-parser
```
### Stop parser

```sh
docker stop dns-markdown-parser
```
### Remove parser

```sh
docker rm dns-markdown-parser
```
### Logs
```sh
docker logs -f dns-markdown-parser
```

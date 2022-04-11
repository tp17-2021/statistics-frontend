
### Statistics frontend

# Config import
While having server running, you need to first download copy of config file with following command. 
```sh
curl http://localhost:8222/elections/voting-data > config.json
```

# Get started

Install libraries
```sh
npm i
```

Run application
```sh
npm run dev
```

# Docker build
```sh
docker build -t statistics-frontend .
docker run --name statistics-frontend  -p 8888:80 statistics-frontend
```

# Problem localhost not working in some browsers
Sometimes there are problems with chrome or safari. Try accessing the app in firefox on localhost or 127.0.0.1 (Try both!)


# Scripts

Run with `npm run <command>`, for example `npm run dev`

| Command   | Description                                   |
|-----------|-----------------------------------------------|
| `dev`     | Development (port 5000)                       |
| `build`   | Build your app for production!                |
| `preview` | Preview the built version of your app locally |


# Extra Configs
We include a few extra configs to help make it easy to ship a Routify project:

| Config Path        | Description                                                                                                                                                |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `netlify.toml`     | This is the [Netlify](https://www.netlify.com/) config, you need this when publishing to Netlify                                                           |
| `vercel.json`      | This is the [Vercel](https://vercel.com/) config, you need this when publishing to Vercel                                                                  |
| `public/.htaccess` | If you build your site to static using [spank](https://www.npmjs.com/package/spank) you will need this when putting your site on an apache based webserver |
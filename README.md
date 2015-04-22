#WMCN.fm

[WMCN.fm](http://wmcn.fm) is a webapp for Macalester College's radio station, WMCN 91.7fm. 
It is designed to be the main client for the station's [API](https://github.com/wmcn-fm/wmcn-api).

##Setup

###Install

```shell
$ git clone https://github.com/wmcn-fm/wmcn.fm.git
$ cd wmcn.fm/
$ npm install
$ bower install
$ gulp sass
```

###Run
> Instructions coming soon on how to deploy the app in sync with the API...running on fake data for now

```shell
$ DEBUG=wmcn.fm npm start
```

View the site at localhost:3000

###Build
`$ gulp sass`: compiles and minifies everything in `public/scss`, piping the output to `public/build/css`

`$ gulp watch`: watches scripts, images, and scss directories for changes

`$ gulp clean`: deletes the compiled directories within `/build` folder (excluding bower_components)

`$ gulp`: default task automatically wipes and re-compiles the build directory on changes to `public/scss/*`


##Sitemap

* `/`
  * `/about`
    * General station info: history, mission, hours, contact information
    * **API interaction**: needs to pull text from files that are editable from the admin interface
  * `/schedule`
    * Serves a PDF of the current semesters' show schedule. Only linked to as a print option through `wmcn.fm/shows`.
    * **API interaction**: must have an update method through the admin interface
  * `/shows`
    * Displays the current semester's show schedule in a calendar view by default; can switch to alphabetical
    * **API interaction**: `GET api.wmcn.fm/v1/shows/current`
      * fire calls to get hosts' info `onload` as well, or as ajax calls `onclick`?
    * `/:id`
      * Info on one specific show: blurb, hosts, active semesters, links to most recent playlists
      * **API interaction**: `GET api.wmcn.fm/v1/shows/:id`
    * `/now`
      * Calculates the "timeslot" given the current time, and then calls `/shows/:id` for that hour, redirecting the user to the current show's page.
      * **API interaction**: `GET api.wmcn.fm/v1/shows/:id`
  * `/staff`
    * Returns a list of all current staff. Station staff (management etc) will be listed first, followed by all DJs alphabetically. **API interaction**: `GET api.wmcn.fm/v1/users`
    * `/:id`
      * One specific user. Their active semesters, shows, links to most recent playlists, reviews, news. **API interaction**: `GET api.wmcn.fm/v1/users/:id`
  * `/apply`
    * Returns the current DJ application.
    * **API interaction**: must display text editable via the admin interface; must be able to `POST api.wmcn.fm/v1/applications`
  * `/archive`
    * landing page for the archive - display search categories and date slider
      * `?dateStart?dateEnd` - search by a particular date range
    * `/shows`
    * `/reviews`
    * `/news`
    * ^ should we even have these categories?
  * `/charts`

##Contributors

Will Kent-Daggett ([@wkentdag](https://github.com/wkentdag))
Jenweil Yang ([@MegaJ](https://github.com/MegaJ))

Advisors: Bret Jackson, Paul Cantrell

##License

MIT
  
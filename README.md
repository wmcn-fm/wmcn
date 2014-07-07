# [wmcn](http://wmcn.tumblr.com)

##to do:
* node.js // mongoDB backend integration to support true archiving and dynamic querying

* bootstrapped-frontend w/ touch integration

* tumblr api will keep tumblr blog up-to-date

* custom application form

* custom admin interface


## url layout:
	|-- /											[info, schedule, contacts, news, reviews + giveaways, playlists]
	  	|------ /archive 							[select dj's, shows, date range, songs, artists]
	  	|
	  	|------ /admin	
		|			|------ /applicants	
		|			|			|------ /dj			[view all dj applications for the current semester]
		|			|			|------ /staff		[view all staff apps for current semester]	
		|			|
		|			|------ /users					[view all users]
		|			|			|------ /{userId}	[edit or delete a user]	 
		|			|
		|			|------ /site 					[change date/schedule slots, application text, turn on link to application banner...]
		|			|------ /scheduler				[UI for creating a schedule: drag and drop, etc]
		|
		|------ /applications
		|			|------ /dj
		|			|------ /staff
		|
		|------ /dj
		|			|------ /main					[select actions: create playlist post, staff application, edit user, log out]
		|			|------ /login					[log in page - or make it a popup?]
		|			|------ /user 					[edit user info: name, id#, etc]
		|			|------ /post					[create a post]
		|
		|------ /show
					|------ /{showId}				[show/link all hosts and episodes]
			


## db collection schema:
- [users](https://github.com/wmcn-fm/wmcn/blob/master/templates/user.json)
	- master collection, contains all current and former users
	- [blogs](https://github.com/wmcn-fm/wmcn/blob/master/templates/user.json)
		- 1-M embedded subdocument for user blog/review entries
		- M-1 references to [artist](https://github.com/wmcn-fm/wmcn/blob/master/templates/artist.json) objects
- [shows](https://github.com/wmcn-fm/wmcn/blob/master/templates/show.json)
	- contains all former and current shows
	- [playlists](https://github.com/wmcn-fm/wmcn/blob/master/templates/show.json)
		- 1-M embedded subdocument for the show's playlists
		- M-1 references to [artist](https://github.com/wmcn-fm/wmcn/blob/master/templates/artist.json) objects
- [artists](https://github.com/wmcn-fm/wmcn/blob/master/templates/artist.json)
	- contain embedded [song](https://github.com/wmcn-fm/wmcn/blob/master/templates/artist.json) subdocuments, created by reference through plyalist or blog collections
- djapps
	- temporary collection for dj applications before they are either flushed or added to the database
- staffapps
	- temporary collection for staff applications before they are flushed or approved


	
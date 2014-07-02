# [wmcn](http://wmcn.tumblr.com)

##to do:
* node.js // mongoDB backend integration to support true archiving and dynamic querying

* bootstrapped-frontend w/ touch integration

* tumblr api will keep tumblr blog up-to-date

* custom application form

* custom admin interface


## url layout:
	|- /					[info, schedule, contacts, news, reviews + giveaways, playlists]
	|------ /archive 		[select dj's, shows, date range, songs, artists]
	|------ /application
	|------------ /dj
	|------------ /staff
	|------ /show
	|------------ /showId	[show/link all hosts and episodes]
	|------ /dj
	|------------ /main		[select actions: create playlist post, staff application, edit user, log out]
	|------------ /login	[log in page - or make it a popup?]
	|------------ /user 	[edit user info: name, id#, etc]
	|------------ /master	[view or edit users or shows]
	|------ /admin		 	
	|------------ /site 	[edit semester, broadcast schedule, application text, turn on link to application...]
	
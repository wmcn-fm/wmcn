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
			
	
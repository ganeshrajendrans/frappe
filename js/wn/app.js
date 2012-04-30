// Copyright (c) 2012 Web Notes Technologies Pvt Ltd (http://erpnext.com)
// 
// MIT License (MIT)
// 
// Permission is hereby granted, free of charge, to any person obtaining a 
// copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation 
// the rights to use, copy, modify, merge, publish, distribute, sublicense, 
// and/or sell copies of the Software, and to permit persons to whom the 
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

wn.Application = Class.extend({
	init: function() {
		// load boot info
		this.load_bootinfo();

		// page container
		this.make_page_container();
		
		// navbar
		this.make_nav_bar();
			
		// favicon
		this.set_favicon();
		// trigger app startup
		$(document).trigger('startup');
		
		// route to home page
		wn.route();
	},
	load_bootinfo: function() {
		LocalDB.sync(wn.boot.docs);
		wn.control_panel = wn.boot.control_panel;
		
		if(wn.boot.error_messages)
			console.log(wn.boot.error_messages)
		if(wn.boot.server_messages) 
			msgprint(wn.boot.server_messages);
		
		this.set_globals();		
	},
	set_globals: function() {
		// for backward compatibility
		profile = wn.boot.profile;
		user = wn.boot.profile.name;
		user_fullname = wn.user_info(user).fullname;
		user_defaults = profile.defaults;
		user_roles = profile.roles;
		user_email = profile.email;
		sys_defaults = wn.boot.sysdefaults;		
	},
	make_page_container: function() {
		wn.container = new wn.views.Container();
		wn.views.make_403();
		wn.views.make_404();
		$('#startup_div').toggle(false);
		$('#body_div').toggle(true);
	},
	make_nav_bar: function() {
		// toolbar
		if(wn.user.name !='Guest') {
			wn.container.wntoolbar = new wn.ui.toolbar.Toolbar();
		}
	},
	logout: function() {
		var me = this;
		wn.call({
			method:'logout',
			callback: function(r) {
				if(r.exc) {
					console.log(r.exc); return;
				}
				me.redirect_to_login();
			}
		})
	},
	redirect_to_login: function() {
		window.location.hash = '';
		window.location.reload();		
	},
	set_favicon: function() {
		var link = $('link[type="image/x-icon"]').remove().attr("href");
		var favicon ='\
			<link rel="shortcut icon" href="' + link + '" type="image/x-icon"> \
			<link rel="icon" href="' + link + '" type="image/x-icon">'

		$(favicon).appendTo('head');
	}
})
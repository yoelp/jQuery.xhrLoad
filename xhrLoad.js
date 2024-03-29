(function($){
	$.fn.xhrLoad = function(url,params,callback){
		 if (typeof url !== "string" && _load) {
	        return _load.apply(this, arguments);
	    }
	
		var selector, response, type, xhr, scriptDiv, self = this,
	        off = url.indexOf(" ");
	
	    if (off >= 0) {
	        selector = url.slice(off, url.length);
	        url = url.slice(0, off);
	    }
	     // If it's a function
	    if (jQuery.isFunction(params)) {
	
	        // We assume that it's the callback
	        callback = params;
	        params = undefined;
	
	        // Otherwise, build a param string
	    } else if (params && typeof params === "object") {
	        type = "POST";
	    }
	
	
	    if (self.length > 0) {
	        xhr = jQuery.ajax({
	            url: url,
	
	            // if "type" variable is undefined, then "GET" method will be used
	            type: type,
	            dataType: "html",
	            data: params
	        })
	        xhr.done(function (responseText) {
	
	            // Save response for use in complete callback
	            response = arguments;
	
	            self.html(selector ?
	
	            // If a selector was specified, locate the right elements in a dummy div
	            // Exclude scripts to avoid IE 'Permission Denied' errors
	            jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :
	
	            // Otherwise use the full result
	            responseText);
	
	            //We do want to run the javascrip that is in the selecter part
	            if(selector){
			scriptDiv = document.createElement("div");
			scriptDiv.innerHTML = responseText;
			scriptDiv = $(scriptDiv).find(selector);
			scriptDiv.filter("script").add(scriptDiv.find("script")).each(function(){
				script = document.createElement("script");
				if(this.src)script.src = this.src;
				if(this.text)script.text = this.text;
				self[0].appendChild(script);
			});
			}
	
	        }).complete(callback &&
	        function (jqXHR, status) {
	            self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
	        });
	    }
	    return xhr;
	};
}(jQuery));

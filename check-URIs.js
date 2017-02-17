
(function(window) {
  /**
	@name modifyPath
	@param {string} urlString
	@return {string}
	@desc Receives url as an input and replaces all the occurrences globally for results [dir/../] - levelone directories and [./] level zero 
	**/
  	this.modifyPath = function (urlString) {
   		var levelOne  = /[^\/]*\/\.\.\//g,   // For checking one/[two/../]  and 'g' for global
        	levelZero = /\.\//g;             // For checking one/[./] 
    
    		return urlString
            	  .replace(levelOne, '')   // Solving directories of 1 level [Replaces one/../file to /file] and as 'g' specifed all matches will be replaced
                  .replace(levelZero, ''); // Solving directories one same level [Removes /./ to ''] 
	}

	/**
	@name checkScheme
	@param {string} scheme1
	@param {string} scheme2
	@return {boolean} true/false
	@desc Receives the schemes [http, https, ftp ..] as an input and checks the equality 
	**/
	this.checkScheme = function (scheme1, scheme2) {
    	return (scheme1.toLowerCase() === scheme2.toLowerCase());
  	}
	
	/**
	@name checkHost
	@param {string} A1
	@param {string} A2
	@return {boolean} true/false
	@desc Receives the host part [example.com:port[80]] and checks the equality 
	**/
	this.checkHost = function (A1, A2) {
    	if (A1.indexOf(':') == -1) {
			A1 += ':80';   // Setting :80 port if port is empty
    	}
    
    	if (A2.indexOf(':') == -1) {
       	 A2 += ':80';  // Setting :80 port if port is empty
    	}
      
    	// Checking the domain and port
    	if (decodeURI(A1.toLowerCase()) !== decodeURI(A2.toLowerCase())) {
      	  return false;
    	}

    	return true;
  	}
	
	/**
	@name checkAuthority
	@param {string} A1
	@param {string} A2
	@return {boolean} true/false
	@desc Receives the Authority part [user:password@domain.com:8080] and checks the equality
	**/
  	this.checkAuthority = function (auth1, auth2) {
    	var A1 = auth1.split('@'),
			A2 = auth2.split('@');
    	
		if (A1.length !== A2.length) {
       	 	return false;
    	}
    
    	// Checking the userAuth 
    	if (A1.length > 1) {
      	  	if (decodeURI(A1[0]) !== decodeURI(A2[0])) {
        	  return false;
      		}
      		A1.splice(1);
      		A2.splice(2);
    	}
      
	    // Checking the host part after '@'
    	if (!this.checkHost(A1[0], A2[0])) {
      	  return false;
    	}
      
		return true;
  	}
  
	/**
	@name compareQueryString
	@param {string} Q1
	@param {string} Q2
	@return {boolean} true/false
	@desc Receives the query string [one=1&two=2]and checks the equality
	**/
  	this.compareQueryString = function (Q1, Q2) {
		var qArr1 = Q1.split('&'),
			qArr2 = Q2.split('&'),
      		qArr1Len = qArr1.length,
      		qArr2Len = qArr2.length,
      		i = 0,
      		qObj1 = {},
      		qObj2 = {}
  
		if (qArr1Len !== qArr2Len) {
    		return false;
  	  	}
  
        for (i; i < qArr1Len; i++) {
    	  var keyMap1 = qArr1[i].split('=');
    	  var keyMap2 = qArr2[i].split('=');
    	  qObj1[keyMap1[0]] = keyMap1[1];
    	  qObj2[keyMap2[0]] = keyMap2[1];
         }
 
       for (var key in qObj1) {
    	 if (!qObj2.hasOwnProperty(key) || qObj1[key] !== qObj2[key]) {
      	   	return false;
    	 }
        }
       return true;
	}
  
	/**
	@name checkFinalURL
	@param {string} finalURL1
	@param {string} finalURL2
	@return {boolean} true/false
	@desc Receives the final string (with/without fragement) [hey?one=1&two=2..#one]and checks the equality
	**/
  	this.checkFinalURL = function (finalURL1, finalURL2) {
    	var path1 = finalURL1.split('?'),
        	path2 = finalURL2.split('?');
  
    
    	if (path1.length !== path2.length) {
       		 return false;
    	 }

    	 // compare queries & fragement part
    	 if (path1.length > 1) {
      	   	var Q1 = path1[1];
      	 	var Q2 = path2[1];
      
      	  	// This is for checking fragment   #somestring
      	  	if (Q1.indexOf('#') !== -1 && Q2.indexOf('#') !== -1) {
                var qArr1 = Q1.split('#');
                var qArr2 = Q2.split('#');
        		if (qArr1[1] !== qArr2[1]) {
          		  return false;
        	  	}
        		Q1 = qArr1[0];
        		Q2 = qArr1[0];
      	  	}
      
      	  // Checking QueryString  key=value&key=nice 
      	  if (!this.compareQueryString(Q1, Q2)) {
        	  return false;
      	  } 
    	}
		
		return true;
  	}
  
  
	/**
	@name _init
	@param {string} u1
	@param {string} u2
	@return {boolean} true/false
	@desc Receives two url and checks the equality
	
      scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
      Authority - [user:password@]host[:port]]
      Path - /file/file2
      QueryString -  '?' [one=one&two=two]
      Fragment - #[randomestuff]
	
	  Hence this task solved in five different modules (functions)
	
	**/
  	this._init = function (u1, u2) {
		 
    	var U1 = modifyPath(u1).split("/"),
			U2 = modifyPath(u2).split("/");

     	   if (U1.length !== U2.length) {
       			return false;
     	   }
    
     	 var scheme1 = U1[0];
     	 var scheme2 = U2[0];
    
      
     	//  Scheme Checking  
    	 if (!this.checkScheme(scheme1, scheme2)) {
      	   return false;
    	 }
      
	  	// Authorty check starts from here
    	 var authority1 = U1[2];
    	 var authority2 = U2[2];
    
    	 if (!this.checkAuthority(authority1, authority2)) {
      	   return false;
    	 }
     
    	 if (U1.length > 3) {
      	   	var path1 = U1.splice(3),
			 	path2 = U2.splice(3),
			 	i = 0;
      
      		for (i; i < path1.length-1; i++) {
        		if (decodeURI(path1[i]) !== decodeURI(path2[i])) {
          		  return false;
        	  	}
      	  	}
        
      	  	var finalURL1 = path1[i],
				finalURL2 = path2[i];
      
	  		  	// Checking the rest of url other than authority and scheme.
      		return this.checkFinalURL(finalURL1, finalURL2);
    	 }
    
    	 return true;
  	}
  
  	window.checkURIs = _init;
	
})(window);


var uri1 = 'http://abc.com:80/~smith/home.html';
var uri2 = 'http://ABC.com/%7Esmith/home.html';

console.log(checkURIs(uri1, uri2));

uri1 = 'http://abc.com/drill/down/foo.html';
uri2 = 'http://abc.com/drill/further/../down/./foo.html';

console.log(checkURIs(uri1, uri2));

uri1 = 'http://abc.com/foo.html?a=1&b=2';
uri2 =  'http://abc.com/foo.html?b=2&a=1';

console.log(checkURIs(uri1, uri2));

uri1 =  'http://abc.com/foo.html?a=1&b=2&a=3';
uri2 =  'http://abc.com/foo.html?a=3&a=1&b=2';

console.log(checkURIs(uri1, uri2));









(function () {
	"use strict";
    var storedShows = [], // List of ids from the shows the user follows
		duplicate = false; //indicates if a show is already followed
	

	
	/**
 	* Saves a list to local storage 
	* @param {list} myShows - List of ids from the shows the user follows
 	*/
	function save(myShows) {
		if (typeof (Storage) !== "undefined") {

			localStorage.setItem("shows", myShows);
		} else {
			alert("Sorry, your browser does not support Web Storage...");
		}
	}

	
	/**
 	* Loads a list from local storage 
 	*/
	function load() {
		if (typeof (Storage) !== "undefined") {
		  // Retrieve
			if (localStorage.getItem("shows")) {
				if (localStorage.getItem("shows").length > 1) {
					storedShows = localStorage.getItem("shows").split(",");

				} else if (localStorage.getItem("shows").length === 1) {
					storedShows = localStorage.getItem("shows").split(" ")[0];
				}
			}
		} else {
			alert("Sorry, your browser does not support Web Storage...");
		}
	}
	
	
	
	 //add an item to the list
	/**
 	* Adds info about a show to the DOM 
	* @param {object} myObj - JSON object with info about the show.
 	*/
    function addNewItem(myObj) {
		
	
				
		var	myList = document.getElementById("myUL"),
			show = document.createElement("li"),
			subListContainer = document.createElement("li"),
			list = document.createElement("ul"),
			closeSpan = document.createElement("SPAN"),
			txt = document.createTextNode("\u00D7"),
			nameSpan = document.createElement("SPAN"),
			nameTxt = document.createTextNode(myObj.name),
			synopsisChoice = document.createElement("li"),
			synopsis = document.createElement("DIV"),
			syn = document.createTextNode("Summary"),
			img = document.createElement("IMG"),
			nextEpChoice = document.createElement("li"),
			nextEpisode = document.createElement("DIV"),
			nextEpisodeLabel = document.createTextNode("Next Episode"),
			link;
		show.className = "col";
		show.classList.add("show");
		show.setAttribute("id", myObj.id);
		show.classList.add("flexContainer");

		document.getElementById("myUL").appendChild(show);
		list.setAttribute("id", myObj.name);
		list.classList.add("sublist");



		//close button
		closeSpan.className = "close";
		closeSpan.appendChild(txt);
		nameSpan.className = "name";
		nameSpan.appendChild(nameTxt);


		//synopsis panel
		img.setAttribute("src", "https" + myObj.image.medium.slice(4, myObj.image.medium.lastIndex));
		synopsisChoice.className = "col";
		synopsisChoice.classList.add("subElement");
		synopsis.className = "synopsis";
		synopsis.appendChild(img);
		synopsis.innerHTML += myObj.summary;

		nextEpChoice.className = "col";
		nextEpChoice.classList.add("subElement");


		//appends in order
		show.appendChild(nameSpan);
		show.appendChild(closeSpan);
		myList.appendChild(subListContainer);
		subListContainer.appendChild(list);
		list.appendChild(synopsisChoice);
		list.appendChild(nextEpChoice);
		synopsisChoice.appendChild(syn);
		synopsisChoice.appendChild(synopsis);
		nextEpChoice.appendChild(nextEpisodeLabel);
		nextEpChoice.appendChild(nextEpisode);
		subListContainer.style.display = "none";
		subListContainer.classList.add("sublistContainer");
		synopsis.style.display = "none";
		nextEpisode.style.display = "none";

		try {
			getData(["https" + myObj._links.nextepisode.href.slice(4, myObj._links.nextepisode.href.lastIndex), showNextEpisode, nextEpisode, show]);
	
		} catch (err) {
			nextEpisode.innerHTML = "<br><br><br>Sorry there is no information about the next episode of this show.";
		}
			
		
	
	}

	
	
		
	 //add an item to the list
	/**
 	* Custom AJAX function 
	* @param {list} args - list of arguments.
	*args[0] is expected to be a link
	*args[1] is expected to be a function
	*The args is passed down to the called function to be used as needed
 	*/
	function getData(args) {
		var response,
			xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", args[0], true);
		xmlhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				response = JSON.parse(this.responseText);
				args[1](response, args);
				
				
				
			}
		};
		xmlhttp.send();
		
		
		
	}
		
	

	/**
 	* Display the search result 
	* @param {object} response - JSON object with info about the show.
 	*/
	function showSearchResult(response) {
		
		var myNodelist = document.getElementsByClassName("show");
		var content = "<img id=\"poster\" src=\"https" + response.image.medium.slice(4, response.image.medium.lastIndex) + "\">";
		document.getElementById("synopsis").innerHTML = response.summary;
		 /* content+="<div onclick=\"newElement(myObj.name)()\" class=\"followBtn\">Search</div>"; */
		document.getElementById("demo").innerHTML = content;
		document.getElementById("result").style.display = "block";
				
				
		duplicate = false;
		var j;
		for (j = 0; j < myNodelist.length; j += 1) {
			console.log(myNodelist[j].firstElementChild.textContent);
				if (myNodelist[j] !== undefined ) {
					if (myNodelist[j].firstElementChild.textContent === response.name) {
						
						duplicate = true;
						break;
					}
				}
						
				
		}
		
		
	}
	


	
	/**
 	* Display the search result 
	* @param {object} response - JSON object with info about the show.
	* @param {list} args - list of references to DOM nodes
 	*/
	function showNextEpisode(response,args) {
		
		var div = args[2],
			parent = args[3];
		var	summary;
		if (response.summary === null) {
			summary = "TBA";
		} else {
			summary = response.summary;
		}
		div.innerHTML = "<br><br><br>Airs on: " + response.airdate + " <br><br><br>Summary: " + summary;
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var airDate = new Date(response.airdate);
		airDate.setHours(0, 0, 0, 0);
		if (today.valueOf() === airDate.valueOf()) {
			var newSpan = document.createElement("SPAN"),
				txt = document.createTextNode("New today!!!");
			newSpan.className = "alert";

			newSpan.appendChild(txt);
			parent.appendChild(newSpan);


		}
			
	
	}

	//////////////////// SEARCH 
	/**
 	* Search function 
	*/
	function search() {
		var searchValue = document.getElementById("searchText").value;
		getData(["https://api.tvmaze.com/singlesearch/shows?q=" + searchValue, showSearchResult]);
		//document.getElementById("searchText").value = "";
	}
	
	
	



	/**
 	* Function is called  when clicking on the "Follow" button 
	* makes a get request to tvmaze
	*/
    function newElement() {
 
			var searchValue = document.getElementById("searchText").value;
			getData(["https://api.tvmaze.com/singlesearch/shows?q=" + searchValue, addNewElement]);		
	}
	
	
	/**
 	* Function that adds a show to the list  when clicking on the "Follow" button if it doesn't already exist	
	*/
	function addNewElement(response) {
		
		console.log(duplicate);
		if (!duplicate) {
			storedShows.push(response.id);
			save(storedShows);
			addNewItem(response);
			document.getElementById("result").style.display = "none";
		} else {
			alert("Duplicate item");
			
		}
		document.getElementById("result").style.display = "none";
		document.getElementById("searchText").value = "";
					
		
		
	}
	
   
    //////////////////////  INITIALIZE  ///////////////////////////////////////////

	/**
 	* Setup function called when the page is visited	
	*/
    function initialize() {
        
        load();
    
        if (storedShows.length > 0) {
            var i;
            for (i = 0; i < storedShows.length; i += 1) {
				getData(["https://api.tvmaze.com/shows/" + storedShows[i], addNewItem]);
		
            }
		}
		
        var myList = document.getElementById("myUL"),
			showID;
        document.getElementById("result").style.display = "none";
		
		
		//deleagated events
		
		myList.addEventListener("click", function (e) {
			if (!e.target.classList.contains("close")) {
				
				if (e.target.classList.contains("col") && e.target.classList.contains("show")) {
					
					e.target.nextSibling.style.display = "block";
					e.target.classList.remove("col");
					// simpleGet(show.getAttribute("id"));


				} else if (!e.target.classList.contains("col") && e.target.classList.contains("show")) {
					e.target.nextSibling.style.display = "none";
					e.target.classList.add("col");

				} else if (!e.target.parentNode.classList.contains("col") && e.target.parentNode.classList.contains("show")) {
					e.target.parentNode.nextSibling.style.display = "none";
					e.target.parentNode.classList.add("col");

				} else if (e.target.parentNode.classList.contains("col") && e.target.parentNode.classList.contains("show")) {
					
					e.target.parentNode.nextSibling.style.display = "block";
					e.target.parentNode.classList.remove("col");

				


				} else if (e.target.classList.contains("col") && e.target.classList.contains("subElement")) {
					e.target.firstElementChild.style.display = "block";
					e.target.classList.remove("col");
					


				} else if (!e.target.classList.contains("col") && e.target.classList.contains("subElement")) {
				
					e.target.firstElementChild.style.display = "none";
					e.target.classList.add("col");

					
				}
			} else if (e.target.classList.contains("close")) {
		

				var parent = e.target.parentNode;
				showID = parent.getAttribute("id");
				myList.removeChild(parent.nextSibling);
				myList.removeChild(parent);


				for (var i=0;i<storedShows.length;i += 1) {
					if(showID === storedShows[i]){
						storedShows.splice( i, 1 );
						save(storedShows);
					}
				}
			}		
		});
		
		document.getElementById("followBtn").addEventListener("click", newElement);
		document.getElementById("addBtn").addEventListener("click", search);
		
			
    }
	
	initialize();
})();
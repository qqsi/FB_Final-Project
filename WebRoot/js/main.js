(function($) {
	$.fn.check_q = function(question, button) {
		if ($("#" + question + " input").val().length <= 0) {
			$("#" + button + " button").attr("disabled", "disabled");
		} else {
			if ($("#" + button + " button").attr("name").length > 0)
				$("#" + button + " button").removeAttr("disabled");
		}
	};
})(jQuery);

(function($) {
	$.fn.reset = function(question, button) {
		$("#" + question + " input").val("");
		$.fn.check_q(question, button);
	};
})(jQuery);

(function($) {
	$.fn.getIndicesOf = function(searchStr, str, caseSensitive) {
		var startIndex = 0, searchStrLen = searchStr.length;
	    var index, indices = new Array();
	    if (!caseSensitive) {
	        str = str.toLowerCase();
	        searchStr = searchStr.toLowerCase();
	    }
	    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
	        indices.push(index);
	        startIndex = index + searchStrLen;
	    }
	    return indices;
	};
})(jQuery);

(function($) {
	$.fn.highlight = function(str, indices) {
		var last = indices[indices.length - 1];
		var key = last["key"];
		
		//sort the index
		var indice = last["value"];
		//console.log(indice);
		indice.sort(function(a,b){return a-b;});
		
		var res = str.substring(0, indice[0]);
		startIndex = 0;
		if(res.length <= 0){
			res = str.substring(0, key.length);
			startIndex = 1;
		}
		for(var i = startIndex; i < indice.length - 1; i++){
			res = res + "<code>" + str.substring(indice[i], indice[i] + key.length) + "</code>" + str.substring(indice[i] + key.length, indice[i + 1]);
		}
		
		return res;
	};
})(jQuery);

(function($) {
	var panel_head = "<div class='panel-heading'><h4 class='panel-title'></h4></div>";
	var button_close;
	var button_more;
	$.fn.submit = function(question, answer_num) {
		var content = $("#" + question + " input").val();
		var params = {
			query : content,
			num : answer_num
		};
		
		var words = content.split(" ");

		$.post("./RequestHandler", params, function(data) {
			//console.log(data);			
			if (data.length == 0) {
				$("#results").html("<h4><p class='text-danger'>Sorry, but PubMed Search has no results!></p></h4>");
				button_more = "<button type='button' class='btn btn-primary' data-dismiss='modal'>Change Question</button>";
				$("#display .modal-footer").html(button_more);
				
				$("#link button").attr("disabled", "disabled");
			} else {
				var panel;
				$("#results").html("");
				$.each(data,function(index, value){
					var body = value["abs"];
					var indices = new Array();
					
					for(var i in words){
						var word = words[i];
						var pattern = {key:"", value:""};
						pattern.key = word.trim();
						pattern.value = $.fn.getIndicesOf(word.trim(), body ,false);
						indices.push(pattern);
					}
					if(words.length > 1){
						var end = {key:"", value:""};
						end.key = content.trim();
						end.value = $.fn.getIndicesOf(content.trim(), body ,false);
						indices.push(end);
					}
					
					var para = $.fn.highlight(body, indices);
					
					panel = "<div " + "id='res_" + index  + "' class='panel panel-default'></div>";
					$("#results").append(panel);
					$("#res_" + index).append(panel_head);
					var title = "<a data-toggle='collapse' data-parent='#accordion' href='#collapse_" + index +"'></a>";
					$("#res_" + index + " .panel-title").html(title);
					
					$("#res_" + index + " a").html("PubMed ID:" + value["pmid"]);
					 
					var collapse;
					//collapse = "<div id='collapse_0' class='panel-collapse collapse in'><div class='panel-body'></div></div>";						 
					collapse = "<div id='collapse_" + index + "' class='panel-collapse collapse'><div class='panel-body'></div></div>";
					 
					$("#res_" + index).append(collapse);
					$("#res_" + index + " .panel-body").html(para);
				 });
				 button_close = "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>";
				 button_more = "<button type='button' class='btn btn-primary'>More Answers</button>";
				 $("#display .modal-footer").html("");
				 $("#display .modal-footer").append(button_close);
				 $("#display .modal-footer").append(button_more);
				 
				 $("#link button").removeAttr("disabled");
			}
		});
	};
})(jQuery);
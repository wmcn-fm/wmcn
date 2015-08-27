module.exports = function(arr1, arr2, htmlElem) {
	var open = '<' + htmlElem + '>';
	var close = '</' + htmlElem + '>';
	var content = '';
	for (var i=0; i<arr1.length; i++) {
		if (arr1[i] != '') {
			var line = open + arr1[i] + ': ' + arr2[i] + close;
			content += line;
		}
	}
	return content;
}

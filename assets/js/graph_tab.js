$('a.linetab').click(function() {
	$('#linechart').show();
	$('#candlestick').hide();
});

$('a.candletab').click(function() {
	$('#candlestick').show();
	$('#linechart').hide();
});
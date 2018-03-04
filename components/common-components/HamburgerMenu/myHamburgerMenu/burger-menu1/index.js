$(function(){


	var open = true,
		$menu = $('#burger-menu'),
		$top = $('#menu-item-top'),
		$middle = $('#menu-item-middle'),
		$bottom = $('#menu-item-bottom');

	$menu.click(function() {
		open = !open;
		if (open) {
			$menu.removeClass('menu-animate');
		} else {
			$menu.addClass('menu-animate');
		}
	});

});
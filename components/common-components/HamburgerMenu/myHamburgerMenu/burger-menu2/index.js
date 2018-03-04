$(function(){


	var open = true,
		$menu = $('#burger-menu'),
		$top = $('#menu-item-top'),
		$middle = $('#menu-item-middle'),
		$bottom = $('#menu-item-bottom');

	$menu.click(function() {
		open = !open;
		if (open) {
			$menu.addClass('menu-close-animate').removeClass('menu-open-animate');
		} else {
			$menu.addClass('menu-open-animate').removeClass('menu-close-animate');
		}
	});

});
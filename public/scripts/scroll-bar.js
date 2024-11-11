// When the user scrolls the page, execute myFunction
window.onscroll = function () {
	scrollBar();
};

function scrollBar() {
	const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	const scrolled = (winScroll / height) * 100;
	document.getElementById("myBar").style.width = `${scrolled}%`;
}

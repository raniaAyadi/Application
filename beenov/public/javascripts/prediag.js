$(document).ready(function()
{
	$("#dialog-link").click(function(event)
	{
		$("#dialog").dialog("open");
		event.preventDefault();
	});

	$("#dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 400,
		height: 300,
		buttons: [
		{
			text: "Enregistrer",
			click: function() 
			{
				$(this).dialog("close");
			}
		}]
	});
});



/* Lightboxes' function. */
/*
function openDialog(dialogId,lastFocused, id)
{
	if (id == 1)
	{
		closeDialog()
		return (0);
	}

	var dialog = document.getElementById(dialogId);
	var heading = dialog.querySelector("h1");
	if(!lastFocused)
		var lastFocused = document.activeElement;

	dialog.style.display = "block";
//	heading.focus();

	function focusToDialog(ev)
	{
		var tmp = ev.target.parentNode;
		while(tmp)
		{
			if(tmp == dialog)
				return;
			tmp = tmp.parentNode;
		}
//		heading.focus();
	}
	document.addEventListener("focus",focusToDialog,true);

	var children = document.getElementsByTagName("body")[0].children;
	var hiddens = [];
   
	for(var i=0,el;el=children[i];i++)
	{
		if(el != dialog)
		{

			var ob = {};

			if(el.hasAttribute("aria-hidden"))
			{
				ob.ariaHidden = el.getAttribute("aria-hidden");
			}
			el.setAttribute("aria-hidden","true");

			ob.el = el;
			hiddens.push(ob);
		}
	}

	var closeButton = dialog.querySelector(".close");

	closeButton.addEventListener("click",closeDialog);
	dialog.addEventListener("keydown",function(ev)
		{
			if(ev.key.slice(0,3) == "Esc")
				closeDialog();
		});

	dialog.closeDialog = closeDialog;

	function closeDialog()
	{
		document.removeEventListener("focus",focusToDialog,true);

		for(var i=0,ob;ob=hiddens[i];i++)
		{
			if(ob.ariaHidden)
			{
				ob.el.setAttribute("aria-hidden",ob.ariaHidden);
			}
			else
			{
				ob.el.removeAttribute("aria-hidden");
			}
		}

		lastFocused.focus();
		dialog.style.display = "none";
	}

	var topFocus = dialog.querySelector(".focus");
	if(!topFocus) 
	{
		topFocus = heading; heading.setAttribute("tabindex","0")
	};

	closeButton.addEventListener("keydown",function(ev)
	{
		if(ev.key == "Tab" && (!ev.shiftKey))
		{
			topFocus.focus();
			ev.preventDefault();
		}
	});

	topFocus.addEventListener("keydown",function(ev)
	{
		if(ev.key == "Tab" && (ev.shiftKey))
		{
			closeButton.focus();
			ev.preventDefault();
		}
	});
}
*/